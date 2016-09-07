import { List, Map } from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state = INITIAL_STATE, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pairs');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);

  if (aVotes > bVotes) return [a];
  else if (aVotes < bVotes) return [b];
  else                      return [a, b];
}

export function next(state) {
  const entries = state.get('entries')
    .concat(getWinners(state.get('vote')));

  if (entries.size === 1) {
    return state.remove('entries')
      .remove('vote')
      .set('winner', entries.first())
  }

  return state.merge({
    vote: Map({pairs: entries.take(2)}),
    entries: entries.skip(2)
  });
}

export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  );
}
