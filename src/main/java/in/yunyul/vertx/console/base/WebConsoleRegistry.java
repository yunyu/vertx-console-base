package in.yunyul.vertx.console.base;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.impl.Utils;

public class WebConsoleRegistry {
    public static final String CONSOLE_ROOT = "consoleroot";
    private static final String PLACEHOLDER_TAG = "<script src=\"vertx-console-placeholder.js\"></script>";

    private final Vertx vertx;
    private final Router router;
    private final String basePath;

    private final String indexHtml;

    public WebConsoleRegistry(Vertx vertx, Router router, String basePath) {
        this.vertx = vertx;
        this.router = router;
        this.basePath = basePath;
        this.indexHtml = Utils.readFileToString(vertx, CONSOLE_ROOT + "/index.html");

        System.out.println(indexHtml);
    }

}
