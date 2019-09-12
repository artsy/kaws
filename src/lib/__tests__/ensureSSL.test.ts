import { ensureSSL } from "../ensureSSL"

describe("Ensure SSL middleware", () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = { params: {}, logout: jest.fn(), url: "/health" }
    res = { redirect: jest.fn() }
    next = jest.fn()
  })

  it("redirects normal http requests to https", () => {
    req.secure = false

    ensureSSL(req, res, next)
    expect(res.redirect.mock.calls[0]).toEqual([
      301,
      "https://kaws-staging.artsy.net/health",
    ])
  })

  it("does not redirect https protocols", () => {
    req.secure = true

    ensureSSL(req, res, next)
    expect(res.redirect).not.toBeCalled()
    expect(next).toBeCalled()
  })
})
