export function calcCombinedProgress(gltfProgress: number, imagesLoaded: boolean): number {
  return Math.round(gltfProgress * 0.6 + (imagesLoaded ? 100 : 0) * 0.4);
}
