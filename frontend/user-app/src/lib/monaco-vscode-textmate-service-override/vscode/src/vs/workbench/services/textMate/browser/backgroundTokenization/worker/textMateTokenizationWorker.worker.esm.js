import { create } from './textMateTokenizationWorker.worker.js';
import { bootstrapSimpleWorker } from 'vscode/vscode/vs/base/common/worker/simpleWorkerBootstrap';

bootstrapSimpleWorker(create);
