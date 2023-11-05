export enum State {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
};

export enum Rating {
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
};

export type ReviewEntry = {
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review: Date;
  rating: Rating | null;
  review: Date | null;
};

export function createReviewEntry(): ReviewEntry {
  return {
    due: new Date(),
    stability: 0,
    difficulty: 0,
    elapsed_days: 0,
    scheduled_days: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    last_review: new Date(),
    rating: null,
    review: null,
  };
}

const request_retention = 0.9;
const maximum_interval = 36500;
const params = [
  0.4,
  0.6,
  2.4,
  5.8,
  4.93,
  0.94,
  0.86,
  0.01,
  1.49,
  0.14,
  0.94,
  2.18,
  0.05,
  0.34,
  1.26,
  0.29,
  2.61,
];


function init_stability(r: number): number {
  return Math.max(params[r - 1], 0.1);
}

function init_difficulty(r: number): number {
  return Math.min(Math.max(params[4] - params[5] * (r - 3), 1), 10);
}

function next_interval(s: number): number {
  let interval = s * 9 * (1 / params.request_retention - 1);
  return Math.min(Math.max(Math.round(interval), 1), maximum_interval);
}

function mean_reversion(init: number, current: number): number {
  return params[7] * init + (1 - params[7]) * current;
}

function next_difficulty(d: number, r: number): number {
  let next_d = d - params[6] * (r - 3);
  return Math.min(Math.max(mean_reversion(params[4], next_d), 1), 10);
}

function next_recall_stability(d: number, s: number, r: number, rating: Rating): number {
  let hard_penalty = rating === Rating.Hard ? params[15] : 1;
  let easy_bonus = rating === Rating.Easy ? params[16] : 1;
  return (
    s *
    (1 +
      Math.exp(params[8]) *
      (11 - d) *
      Math.pow(s, -params[9]) *
      (Math.exp((1 - r) * params[10]) - 1) *
      hard_penalty *
      easy_bonus)
  );
}

function next_forget_stability(d: number, s: number, r: number): number {
  return (
    params[11] *
    Math.pow(d, -params[12]) *
    (Math.pow(s + 1, params[13]) - 1) *
    Math.exp((1 - r) * params[14])
  );
}

function updateDS(
  card: ReviewEntry,
  last_d: number,
  last_s: number,
  retrievability: number,
  rating: Rating
): ReviewEntry {
  const difficulty = next_difficulty(last_d, rating);

  let stability;
  if (rating === Rating.Again) {
    stability = next_forget_stability(difficulty, last_s, retrievability);
  } else {
    stability = next_recall_stability(difficulty, last_s, retrievability, rating);
  }

  return {
    ...card,
    difficulty,
    stability
  };
}


function initDS(card: ReviewEntry, rating: Rating): ReviewEntry {
  const difficulty = init_difficulty(rating);
  const stability = init_stability(rating);

  return {
    ...card,
    difficulty: difficulty,
    stability: stability
  };
}
function updateReviewEntryState(card: ReviewEntry, rating: Rating): ReviewEntry {
  let newState;
  let lapses = card.lapses || 0;

  switch (card.state) {
    case State.New:
      if (rating === Rating.Again) {
        newState = State.Learning;
        lapses += 1;
      } else if (rating === Rating.Easy) {
        newState = State.Review;
      } else {
        newState = State.Learning;
      }
      break;

    case State.Learning:
    case State.Relearning:
      if (rating === Rating.Good || rating === Rating.Easy) {
        newState = State.Review;
      } else {
        newState = card.state;
      }
      break;

    case State.Review:
      if (rating === Rating.Again) {
        newState = State.Relearning;
        lapses += 1;
      } else {
        newState = State.Review;
      }
      break;

    default:
      newState = card.state;
  }

  return {
    ...card,
    state: newState,
    lapses: lapses
  };
}


function scheduleCard(
  card: ReviewEntry,
  rating: Rating,
  now: Date,
  hard_interval: number,
  good_interval: number,
  easy_interval: number
): ReviewEntry {
  let scheduled_days, due;

  switch (rating) {
    case Rating.Again:
      scheduled_days = 0;
      due = new Date(now.getTime() + 5 * 60 * 1000);
      break;

    case Rating.Hard:
      scheduled_days = hard_interval;
      if (hard_interval > 0) {
        due = new Date(now.getTime() + hard_interval * 24 * 60 * 60 * 1000);
      } else {
        due = new Date(now.getTime() + 10 * 60 * 1000);
      }
      break;

    case Rating.Good:
      scheduled_days = good_interval;
      due = new Date(now.getTime() + good_interval * 24 * 60 * 60 * 1000);
      break;

    case Rating.Easy:
      scheduled_days = easy_interval;
      due = new Date(now.getTime() + easy_interval * 24 * 60 * 60 * 1000);
      break;

    default:
      return card;
  }

  return {
    ...card,
    scheduled_days: scheduled_days,
    due: due
  };
}


function reviewCard(
  card: ReviewEntry,
  now: Date,
  rating: Rating
): ReviewEntry {
  let updatedCard = { ...card };

  if (updatedCard.state === State.New) {
    updatedCard.elapsed_days = 0;
  } else {
    updatedCard.elapsed_days =
      (now.getTime() - updatedCard.last_review.getTime()) / 86400000;
  }
  updatedCard.last_review = now;
  updatedCard.reps += 1;

  let hard_interval;
  let good_interval;
  let easy_interval;

  switch (updatedCard.state) {
    case State.New:
      updatedCard = initDS(card, rating);
      switch (rating) {
        case Rating.Again:
          updatedCard.due = new Date(now.getTime() + 60 * 1000);
          break;
        case Rating.Hard:
          updatedCard.due = new Date(now.getTime() + 5 * 60 * 1000);
          break;
        case Rating.Good:
          updatedCard.due = new Date(now.getTime() + 10 * 60 * 1000);
          break;
        case Rating.Easy:
          let easy_interval = next_interval(updatedCard.stability);
          updatedCard.scheduled_days = easy_interval;
          updatedCard.due = new Date(
            now.getTime() + easy_interval * 24 * 60 * 60 * 1000
          );
          break;
      }
      break;

    case State.Learning:
    case State.Relearning:
      good_interval = next_interval(updatedCard.stability);
      easy_interval = Math.max(
        next_interval(updatedCard.stability),
        good_interval + 1
      );
      switch (rating) {
        case Rating.Hard:
          updatedCard.due = new Date(now.getTime() + 10 * 60 * 1000);
          break;
        case Rating.Good:
          updatedCard.due = new Date(
            now.getTime() + good_interval * 24 * 60 * 60 * 1000
          );
          break;
        case Rating.Easy:
          updatedCard.due = new Date(
            now.getTime() + easy_interval * 24 * 60 * 60 * 1000
          );
          break;
      }
      break;

    case State.Review:
      let interval = updatedCard.elapsed_days;
      let last_d = updatedCard.difficulty;
      let last_s = updatedCard.stability;
      let retrievability = Math.pow(1 + interval / (9 * last_s), -1);

      hard_interval = next_interval(updatedCard.stability);
      good_interval = next_interval(updatedCard.stability);
      hard_interval = Math.min(hard_interval, good_interval);
      good_interval = Math.max(good_interval, hard_interval + 1);
      easy_interval = Math.max(
        next_interval(updatedCard.stability),
        good_interval + 1
      );

      switch (rating) {
        case Rating.Hard:
          updatedCard.due = new Date(
            now.getTime() + hard_interval * 24 * 60 * 60 * 1000
          );
          break;
        case Rating.Good:
          updatedCard.due = new Date(
            now.getTime() + good_interval * 24 * 60 * 60 * 1000
          );
          break;
        case Rating.Easy:
          updatedCard.due = new Date(
            now.getTime() + easy_interval * 24 * 60 * 60 * 1000
          );
          break;
      }
      break;
  }

  return scheduleCard(updateReviewEntryState(updatedCard, rating), rating, now, hard_interval, good_interval, easy_interval);
}

