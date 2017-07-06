package in.yunyul.vertx.console.base;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.impl.Utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@SuppressWarnings("unused")
public class WebConsoleRegistry {
    public static final String CONSOLE_ROOT = "consoleroot";

    private final String basePath;

    public static WebConsoleRegistry create(String basePath) {
        return new WebConsoleRegistry(basePath);
    }

    public WebConsoleRegistry(String basePath) {
        // Remove trailing slashes
        if (basePath.endsWith("/")) {
            basePath = basePath.substring(0, basePath.length() - 1);
        }
        this.basePath = basePath;
    }

    private List<ConsolePage> pages = new ArrayList<>();

    public WebConsoleRegistry addPage(ConsolePage page) {
        pages.add(page);
        return this;
    }

    private boolean cacheBusterEnabled;

    public WebConsoleRegistry setCacheBusterEnabled(boolean enabled) {
        this.cacheBusterEnabled = enabled;
        return this;
    }

    private static final String PLACEHOLDER_TAG = "<script src=\"vertx-console-placeholder.js\"></script>";
    private boolean mounted = false;

    public WebConsoleRegistry mount(Vertx vertx, Router router) {
        if (pages.size() == 0) {
            throw new IllegalStateException("At least one page must be added before mounting");
        }
        if (mounted) {
            throw new IllegalStateException("Registry already mounted");
        }
        mounted = true;

        // Don't manipulate original pages list
        List<ConsolePage> pagesToMount = new ArrayList<>(pages);
        pagesToMount.add(new BaseConsolePage());

        StringBuilder scriptTags = new StringBuilder();
        for (ConsolePage page : pagesToMount) {
            page.mount(vertx, router, basePath);
            if (basePath == null) continue;
            scriptTags.append("<script src=\"")
                    .append(basePath)
                    .append(page.getLoaderFileName());
            if (cacheBusterEnabled) {
                scriptTags.append("?").append(ThreadLocalRandom.current().nextInt(Integer.MAX_VALUE));
            }
            scriptTags.append("\"></script>");
        }

        String indexHtml = Utils.readFileToString(vertx, CONSOLE_ROOT + "/index.html")
                .replace(PLACEHOLDER_TAG, scriptTags);
        router.route(basePath + '/').handler(ctx -> {
            HttpServerResponse res = ctx.response();
            res.putHeader("Content-Type", "text/html");
            res.end(indexHtml);
        });
        router.route(basePath + "/*").handler(StaticHandler.create(CONSOLE_ROOT));
        return this;
    }
}
