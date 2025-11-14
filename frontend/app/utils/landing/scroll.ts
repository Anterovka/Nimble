export function smoothScrollTo(elementId: string, lenis: any) {
  const element = document.getElementById(elementId);
  if (element && lenis) {
    const headerHeight = 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 20;
    lenis.scrollTo(offsetPosition, { 
      duration: 1.2, 
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  }
}

