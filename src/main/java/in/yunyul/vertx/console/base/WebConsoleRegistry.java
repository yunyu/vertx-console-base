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
    /**
     * The value of the console root, where scripts are loaded from
     */
    public static final String CONSOLE_ROOT = "consoleroot";

    private final String basePath;

    /**
     * Creates the registry using the specified base path
     *
     * @param basePath the base path to mount the registry under
     * @return the registry
     */
    public static WebConsoleRegistry create(String basePath) {
        return new WebConsoleRegistry(basePath);
    }

    /**
     * Creates the registry using the specified base path
     *
     * @param basePath the base path to mount the registry under
     */
    public WebConsoleRegistry(String basePath) {
        // Remove trailing slashes
        if (basePath.endsWith("/")) {
            basePath = basePath.substring(0, basePath.length() - 1);
        }
        this.basePath = basePath;
    }

    private List<ConsolePage> pages = new ArrayList<>();

    /**
     * Adds a page to the registry
     *
     * @param page the page to add
     * @return the registry
     */
    public WebConsoleRegistry addPage(ConsolePage page) {
        pages.add(page);
        return this;
    }

    private boolean cacheBusterEnabled;

    /**
     * Enables cache busting (query parameter) randomization on injected scripts
     *
     * @param enabled whether the cache buster should be enabled
     * @return the registry
     */
    public WebConsoleRegistry setCacheBusterEnabled(boolean enabled) {
        this.cacheBusterEnabled = enabled;
        return this;
    }

    private static final String PLACEHOLDER_TAG = "<script src=\"vertx-console-placeholder.js\"></script>";
    private boolean mounted = false;

    /**
     * Mounts the console under the base path
     *
     * @param vertx  the Vert.x instance
     * @param router the router to mount the console on
     * @return the registry
     */
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
