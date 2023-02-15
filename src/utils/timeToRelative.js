const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto', style: 'short' });

const timeUnits = new Set([
  { interval: 60, timeUnit: 'minutes' }, // start with mins insteads of secs, 1 min ago is better than 23 secs ago..
  { interval: 24, timeUnit: 'hours' },
  { interval: 7, timeUnit: 'days' },
  { interval: 4.34524, timeUnit: 'weeks' },
  { interval: 12, timeUnit: 'months' },
  { interval: Number.POSITIVE_INFINITY, timeUnit: 'years' }
]);

export function toRelativeTime(postDateSecs, dateNow) {
  const postDateMsec = new Date(postDateSecs * 1000);
  let timeDiff = (postDateMsec - dateNow) / 60_000;  // millsecs to minutes

  for (const unit of timeUnits) {
    if (Math.abs(timeDiff) < unit.interval) {
      return formatter.format(Math.round(timeDiff), unit.timeUnit);
    }
    timeDiff /= unit.interval;
  }
}
