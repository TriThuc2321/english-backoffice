import type { PreviewView } from '../samples';

import {
  JudgeView,
  McqView,
  MultiView,
  PhotoView,
  QuestionResponseView,
  TextCompletionView,
} from './choice';
import {
  DiagramView,
  SentenceView,
  ShortAnswerView,
  SummaryView,
  TableView,
  TemplateView,
} from './completion';
import { MapView, MatchingView } from './matching';
import { SpeakView, WriteView } from './productive';

export const VIEWS: Record<PreviewView, React.ComponentType> = {
  mcq: McqView,
  multi: MultiView,
  judge: JudgeView,
  matching: MatchingView,
  template: TemplateView,
  sentence: SentenceView,
  summary: SummaryView,
  table: TableView,
  diagram: DiagramView,
  map: MapView,
  short: ShortAnswerView,
  photo: PhotoView,
  qresp: QuestionResponseView,
  textcomp: TextCompletionView,
  speak: SpeakView,
  write: WriteView,
};
