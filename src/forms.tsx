import * as React from 'react'

export interface Lens<AllData, ScopedData> {
  get: (data: AllData) => ScopedData;
  set: (data: AllData, newValue: ScopedData) => AllData;
}

export function fromProp<AllData>(): <Field extends keyof AllData>(field: Field) => Lens<AllData, AllData[Field]> {
  return field => ({
    get: (data) => data[field],
    set: (data, value) => ({ ...data, [field]: value })
  })
}

export type Form<Value, Result> = (currentValue: Value) => {
  ui: (onChange: (newValue: Value) => void) => JSX.Element;
  result: () => Result;
}

export const mapForm = <Value, A, B>(f: (a: A) => B, form: Form<Value, A>): Form<Value, B> => {
  return (value: Value) => {
    const { ui, result } = form(value);

    return {
      ui,
      result: () => f(result())
    }
  }
}

export const applyForm = <Value, A, B>(formAB: Form<Value, (a: A) => B>, formA: Form<Value, A>): Form<Value, B> => {
  return (value: Value) => {
    const { ui: uiAB, result: resultAB } = formAB(value);
    const { ui: uiA, result: resultA } = formA(value);

    return {
      ui: (onChange: (newValue: Value) => void) => (
        <>
          {uiAB(onChange)}
          {uiA(onChange)}
        </>
      ),
      result: () => resultAB()(resultA())
    }
  }
}

export const textbox: Form<string, string> = (currentValue: string) => ({
  ui: (onChange: (newValue: string) => void) => (
    <input value={currentValue} onChange={(e) => onChange(e.target.value)} />
  ),
  result: () => currentValue
})

export const scopeFormElement = <AllData, ScopedData>(
  lens: Lens<AllData, ScopedData>,
  form: Form<ScopedData, ScopedData>
): Form<AllData, ScopedData> =>
  (currentValue: AllData) => {
    const { ui, result } = form(lens.get(currentValue));

    return {
      ui: (onChange: (newValue: AllData) => void) => ui((newValue: ScopedData) => onChange(lens.set(currentValue, newValue))),
      result
    }
  }
