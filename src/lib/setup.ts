import ddTracer from "dd-trace"

export const setupDataDog = () => {
  if (process.env.DD_APM_ENABLED) {
    ddTracer.init({
      hostname: process.env.DD_TRACE_AGENT_HOSTNAME,
      service: "kaws",
      plugins: false,
    })
    ddTracer.use("express", {
      // We want the root spans of MP to be labelled as just `service`
      service: "kaws",
      headers: ["User-Agent"],
    })
    ddTracer.use("graphql", {
      // We want the root spans of MP to be labelled as just `service`
      service: "kaws.graphql",
    })
    ddTracer.use("http", {
      service: `kaws.http-client`,
    })
  }
}
