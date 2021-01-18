try {
  const x = 'here I would have some code for try block';
} catch {

}

function hasTry() {
  try {
    const x = 'here I would have some code for try block';
  } catch {

  }
}

const myPromise = new Promise(() => {});

myPromise.catch(() => {
  const x = 'here I would do something based on reason';
});
