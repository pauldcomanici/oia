try {
  const x = 'here I would have some code for try block';
} catch {
  console.error("[using-default-options/catch-no-reason/input.js:3:8]", "catchClause");
}

function hasTry() {
  console.log("[using-default-options/catch-no-reason/input.js:7:18]", "hasTry");

  try {
    const x = 'here I would have some code for try block';
  } catch {
    console.error("[using-default-options/catch-no-reason/input.js:10:10]", "catchClause");
  }
}

const myPromise = new Promise(() => {
  console.log("[using-default-options/catch-no-reason/input.js:15:36]", "array-item-0");
});
myPromise.catch(() => {
  console.error("[using-default-options/catch-no-reason/input.js:17:22]", "memberExpressionCatch");
  const x = 'here I would do something based on reason';
});
