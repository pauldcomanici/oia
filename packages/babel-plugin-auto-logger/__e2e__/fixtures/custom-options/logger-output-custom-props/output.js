function sum(a, b) {
  console.log({
    path: "[custom-options/logger-output-custom-props/input.js:1:19]",
    from: "sum"
  });

  try {
    const myPromise = new Promise(() => {
      console.log({
        path: "[custom-options/logger-output-custom-props/input.js:4:40]",
        from: "array-item-0"
      });
    });
    myPromise.catch(reason => {
      console.error({
        path: "[custom-options/logger-output-custom-props/input.js:6:32]",
        from: "memberExpressionCatch",
        fnArgs: [reason]
      });
      const rejectHandler = 'some implementation for sum';
    });
  } catch (ex) {
    console.error({
      path: "[custom-options/logger-output-custom-props/input.js:9:15]",
      from: "catchClause",
      fnArgs: [ex]
    });
    const catchBlock = 'demo purpose for sum';
  }

  return a + b;
}

function sub(a, b) {
  console.log({
    path: "[custom-options/logger-output-custom-props/input.js:16:19]",
    from: "sub"
  });

  try {
    const myPromise = new Promise(() => {
      console.log({
        path: "[custom-options/logger-output-custom-props/input.js:19:40]",
        from: "array-item-0"
      });
    });
    myPromise.catch(reason => {
      console.error({
        path: "[custom-options/logger-output-custom-props/input.js:21:32]",
        from: "memberExpressionCatch",
        fnArgs: [reason]
      });
      const rejectHandler = 'some implementation for sub';
    });
  } catch (ex) {
    console.error({
      path: "[custom-options/logger-output-custom-props/input.js:24:15]",
      from: "catchClause",
      fnArgs: [ex]
    });
    const catchBlock = 'demo purpose for sub';
  }

  return a - b;
}

function multiply(a, b) {
  console.log({
    path: "[custom-options/logger-output-custom-props/input.js:31:24]",
    from: "multiply"
  });

  try {
    const myPromise = new Promise(() => {
      console.log({
        path: "[custom-options/logger-output-custom-props/input.js:34:40]",
        from: "array-item-0"
      });
    });
    myPromise.catch(reason => {
      console.error({
        path: "[custom-options/logger-output-custom-props/input.js:36:32]",
        from: "memberExpressionCatch",
        fnArgs: [reason]
      });
      const rejectHandler = 'some implementation for multiply';
    });
  } catch (ex) {
    console.error({
      path: "[custom-options/logger-output-custom-props/input.js:39:15]",
      from: "catchClause",
      fnArgs: [ex]
    });
    const catchBlock = 'demo purpose for multiply';
  }

  return a * b;
}

function division(a, b) {
  console.log({
    path: "[custom-options/logger-output-custom-props/input.js:46:24]",
    from: "division"
  });

  try {
    const myPromise = new Promise(() => {
      console.log({
        path: "[custom-options/logger-output-custom-props/input.js:49:40]",
        from: "array-item-0"
      });
    });
    myPromise.catch(reason => {
      console.error({
        path: "[custom-options/logger-output-custom-props/input.js:51:32]",
        from: "memberExpressionCatch",
        fnArgs: [reason]
      });
      const rejectHandler = 'some implementation for division';
    });
  } catch (ex) {
    console.error({
      path: "[custom-options/logger-output-custom-props/input.js:54:15]",
      from: "catchClause",
      fnArgs: [ex]
    });
    const catchBlock = 'demo purpose for division';
  }

  return a / b;
}
