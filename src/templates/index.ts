import { ExcalidrawTemplate } from './types';
import { flowchartTemplate } from './flowchartTemplate';
import { architectureTemplate } from './architectureTemplate';
import { wireframeTemplate } from './wireframeTemplate';

export * from './types';
export * from './flowchartTemplate';
export * from './architectureTemplate';
export * from './wireframeTemplate';

export const templates: ExcalidrawTemplate[] = [
  flowchartTemplate,
  architectureTemplate,
  wireframeTemplate,
];
