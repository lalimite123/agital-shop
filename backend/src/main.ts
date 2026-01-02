import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const allowed = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173")
    .split(",")
    .map((s) => s.trim())

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      const ok = allowed.some((o) => {
        if (o.startsWith("*.") && origin.endsWith(o.slice(1))) return true
        return o === origin
      })
      callback(ok ? null : new Error("Not allowed by CORS"), ok)
    },
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  const port = parseInt(process.env.PORT || "4000", 10)
  await app.listen(port, "0.0.0.0")
  console.log(`🚀 Backend running on http://localhost:${port}`)
}
bootstrap()
