import { Transform } from "class-transformer";

const ToInteger = () => {
  const toPlain = Transform(
    ({ value }) => {
      return value;
    },
    {
      toPlainOnly: true,
    }
  );
  const toClass = (target: any, key: string) => {
    return Transform(
      ({ obj }) => {
        return valueToInteger(obj[key]);
      },
      {
        toClassOnly: true,
      }
    )(target, key);
  };
  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
};

const valueToInteger = (value: any) => {
  if (value === undefined) {
    return undefined;
  }
  if (isNaN(value)) {
    return null;
  }
  if (value === "") {
    return null;
  }
  if (value === "null") {
    return null;
  }
  const x = parseInt(value);

  return x;
};

export { ToInteger };
