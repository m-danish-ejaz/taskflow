export interface ValidatorInfo {
  type: "required" | "minLength" | "maxLength" | "pattern";
  message: string;
  value?: number | RegExp; // `value` can be a number or a `RegExp`
}
