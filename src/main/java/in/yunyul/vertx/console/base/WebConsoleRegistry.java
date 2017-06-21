package in.yunyul.vertx.console.base;

import io.vertx.core.Vertx;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.impl.Utils;

import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unused")
public class WebConsoleRegistry {
    public static final String CONSOLE_ROOT = "consoleroot";

    private final Vertx vertx;
    private final Router router;
    private final String basePath;


    public WebConsoleRegistry(Vertx vertx, Router router, String basePath) {
        this.vertx = vertx;
        this.router = router;
        // Remove trailing slashes
        if (basePath.endsWith("/")) {
            basePath = basePath.substring(0, basePath.length() - 1);
        }
        this.basePath = basePath;
    }

    private List<ConsolePage> pages = new ArrayList<>();

    public void addPage(ConsolePage page) {
        pages.add(page);
    }

    private static final String PLACEHOLDER_TAG = "<script src=\"vertx-console-placeholder.js\"></script>";
    private boolean mounted = false;

    public void mount() {
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
            scriptTags.append("<script src=\"")
                    .append(basePath)
                    .append(page.getLoaderFileName())
                    .append("\"></script>");
        }

        String indexHtml = Utils.readFileToString(vertx, CONSOLE_ROOT + "/index.html")
                .replace(PLACEHOLDER_TAG, scriptTags);
        router.route(basePath + '/').handler(ctx -> {
            HttpServerResponse res = ctx.response();
            res.putHeader("Content-Type", "text/html");
            res.end(indexHtml);
        });
        router.route(basePath + "/*").handler(StaticHandler.create(CONSOLE_ROOT));
    }

}
