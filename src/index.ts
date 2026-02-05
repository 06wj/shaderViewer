/* global SHADER_COMPILER_VERSION */

export { default as compiler } from './compiler';

declare const SHADER_COMPILER_VERSION: string;
export const version = SHADER_COMPILER_VERSION;
