export function generateStep(order: number, action: string, command?: string, targetFile?: string) {
  return { order, action, command, targetFile };
}
