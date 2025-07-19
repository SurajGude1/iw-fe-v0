const envMode = process.env.NEXT_PUBLIC_ENV_MODE;

// for debugging
// console.log("ENV_MODE:", envMode);
// console.log("LOCAL URL:", process.env.NEXT_PUBLIC_GOLANG_API_BASE_URL_LOCAL);
// console.log("PROD URL:", process.env.NEXT_PUBLIC_GOLANG_API_BASE_URL_PROD);

let GOLANG_API_BASE_URL;

if (envMode === "DEV") {
  GOLANG_API_BASE_URL = process.env.NEXT_PUBLIC_GOLANG_API_BASE_URL_LOCAL;
} else if (envMode === "PROD") {
  GOLANG_API_BASE_URL = process.env.NEXT_PUBLIC_GOLANG_API_BASE_URL_PROD;
} else {
  console.warn("ENV_MODE is not defined properly. Defaulting to LOCAL.");
  GOLANG_API_BASE_URL = process.env.NEXT_PUBLIC_GOLANG_API_BASE_URL_LOCAL;
}

console.log("Resolved API BASE URL:", GOLANG_API_BASE_URL);

export { GOLANG_API_BASE_URL };
