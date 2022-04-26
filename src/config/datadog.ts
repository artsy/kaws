import tracer from "dd-trace"
const { DD_APM_ENABLED, DD_TRACE_AGENT_HOSTNAME } = process.env

export const setupDataDog = () => {
  if (DD_APM_ENABLED) {
    tracer.init({
      hostname: DD_TRACE_AGENT_HOSTNAME,
      service: "kaws",
      plugins: false,
      // TODO: figure out how to get the debugger working
      // debug: true,
      // logger: {
      //   debug: console.log,
      //   error: console.error,
      // },
    })
    tracer.use("express", {
      service: "kaws",
      headers: ["User-Agent"],
    })
    tracer.use("graphql", {
      service: "kaws.graphql",
    })
    tracer.use("http", {
      service: `kaws.http-client`,
    })
  }
}
