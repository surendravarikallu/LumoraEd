declare module 'xss-clean' {
  function xss(): (req: any, res: any, next: any) => void;
  export = xss;
}
