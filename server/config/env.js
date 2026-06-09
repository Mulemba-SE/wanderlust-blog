const REQUIRED_ENV_VARS = [
    "PGHOST",
    "PGPORT",
    "PGUSER",
    "PGPASSWORD",
    "PGDATABASE",
    "JWT_SECRET",
    "ALLOWED_ORIGINS",
    "ADMIN_EMAIL",
];
export function getMissingEnvVars(env = process.env) {
    return REQUIRED_ENV_VARS.filter((key) => !env[key]);
}
export function validateEnv(env = process.env) {
    const missing = getMissingEnvVars(env);
    if (missing.length > 0) {
        console.error("Missing required environment variables:");
        missing.forEach((key) => console.error(`   - ${key}`));
        console.error("\nCreate a .env file at the project root with these variables.");
        process.exit(1);
    }
    console.log("Environment variables validated.");
}
export function getAllowedOrigins(env = process.env) {
    return (env.ALLOWED_ORIGINS ?? "")
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
}
export function getAdminEmail(env = process.env) {
    return env.ADMIN_EMAIL ?? undefined;
}
export function getFrontendUrl(env = process.env) {
    return env.FRONTEND_URL ?? "http://localhost:5173";
}
export function getEmailFrom(env = process.env) {
    return env.EMAIL_FROM ?? "no-reply@wanderlust.local";
}
export function getSmtpConfig(env = process.env) {
    return {
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS,
        },
    };
}
