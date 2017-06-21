package in.yunyul.vertx.console.base;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;

public interface ConsolePage {
    void mount(Vertx vertx, Router router, String basePath);

    String getLoaderFileName();
}
