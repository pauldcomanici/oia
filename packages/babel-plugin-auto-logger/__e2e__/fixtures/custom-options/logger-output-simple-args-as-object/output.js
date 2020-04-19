function sum(a, b) {
  console.log("[custom-options/logger-output-simple-args-as-object/input.js:1:19]", "sum");

  try {
    const myPromise = new Promise(() => {
      console.log("[custom-options/logger-output-simple-args-as-object/input.js:4:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      console.error("[custom-options/logger-output-simple-args-as-object/input.js:6:32]", "memberExpressionCatch", {
        reason: reason
      });
      const rejectHandler = 'some implementation for sum';
    });
  } catch (ex) {
    console.error("[custom-options/logger-output-simple-args-as-object/input.js:9:15]", "catchClause", {
      ex: ex
    });
    const catchBlock = 'demo purpose for sum';
  }

  return a + b;
}

function sub(a, b) {
  console.log("[custom-options/logger-output-simple-args-as-object/input.js:16:19]", "sub");

  try {
    const myPromise = new Promise(() => {
      console.log("[custom-options/logger-output-simple-args-as-object/input.js:19:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      console.error("[custom-options/logger-output-simple-args-as-object/input.js:21:32]", "memberExpressionCatch", {
        reason: reason
      });
      const rejectHandler = 'some implementation for sub';
    });
  } catch (ex) {
    console.error("[custom-options/logger-output-simple-args-as-object/input.js:24:15]", "catchClause", {
      ex: ex
    });
    const catchBlock = 'demo purpose for sub';
  }

  return a - b;
}

function multiply(a, b) {
  console.log("[custom-options/logger-output-simple-args-as-object/input.js:31:24]", "multiply");

  try {
    const myPromise = new Promise(() => {
      console.log("[custom-options/logger-output-simple-args-as-object/input.js:34:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      console.error("[custom-options/logger-output-simple-args-as-object/input.js:36:32]", "memberExpressionCatch", {
        reason: reason
      });
      const rejectHandler = 'some implementation for multiply';
    });
  } catch (ex) {
    console.error("[custom-options/logger-output-simple-args-as-object/input.js:39:15]", "catchClause", {
      ex: ex
    });
    const catchBlock = 'demo purpose for multiply';
  }

  return a * b;
}

function division(a, b) {
  console.log("[custom-options/logger-output-simple-args-as-object/input.js:46:24]", "division");

  try {
    const myPromise = new Promise(() => {
      console.log("[custom-options/logger-output-simple-args-as-object/input.js:49:40]", "array-item-0");
    });
    myPromise.catch(reason => {
      console.error("[custom-options/logger-output-simple-args-as-object/input.js:51:32]", "memberExpressionCatch", {
        reason: reason
      });
      const rejectHandler = 'some implementation for division';
    });
  } catch (ex) {
    console.error("[custom-options/logger-output-simple-args-as-object/input.js:54:15]", "catchClause", {
      ex: ex
    });
    const catchBlock = 'demo purpose for division';
  }

  return a / b;
}
