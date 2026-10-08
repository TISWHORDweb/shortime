import { connectDb } from "./config/db";
import { env } from "./config/env";
import { app } from "./app";

const bootstrap = async (): Promise<void> => {
  await connectDb();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${env.PORT}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to boot API", error);
  process.exit(1);
});
