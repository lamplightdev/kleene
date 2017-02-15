module.exports = (timer = {
  id: false,
  start: false,
  end: false,
  paused: false,
  splits: [],
}) => (`
  <div class='container'>
    <h1 id='elapsed' class='time'>${timer.end ? (timer.end - timer.start) : (Date.now() - timer.start)}</h1>
    <div id='splits'>
      ${[...timer.splits].reverse().map((split, splitIndex) => `<chrono-timersplit id='split-${splitIndex}' state='${JSON.stringify(split)}'></chrono-timersplit>`)}
    </div>
    <form id='pause'>
      <chrono-button><span id='stop'>Stop</span><span id='start'>Start</span></chrono-button>
    </form>
    <form id='split' ${timer.paused ? 'hide' : ''}>
      <chrono-button>Split</chrono-button>
    </form>
  </div>
`);
