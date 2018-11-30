import formatMoney from "../lib/formatMoney";

describe("formatMoney Utility Function", () => {
  it("formats sub-dollars properly", () => {
    expect(formatMoney(1)).toEqual("$0.01");
    expect(formatMoney(10)).toEqual("$0.10");
    expect(formatMoney(99)).toEqual("$0.99");
  });

  it("cuts off empty cents for whole dollars", () => {
    expect(formatMoney(100)).toEqual("$1");
    expect(formatMoney(6700)).toEqual("$67");
    expect(formatMoney(10000000)).toEqual("$100,000");
  });

  it("formats fractional dollars properly", () => {
    expect(formatMoney(5012)).toEqual("$50.12");
    expect(formatMoney(101)).toEqual("$1.01");
    expect(formatMoney(110)).toEqual("$1.10");
    expect(formatMoney(9123839482349823)).toEqual("$91,238,394,823,498.23");
  });

  it("formats negative amounts properly", () => {
    expect(formatMoney(-10)).toEqual("-$0.10");
    expect(formatMoney(-100)).toEqual("-$1");
    expect(formatMoney(-12583)).toEqual("-$125.83");
  });
});
