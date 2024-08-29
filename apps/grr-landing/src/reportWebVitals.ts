import { ReportOpts } from 'web-vitals';

// FIXME: After updating dependencies, getCLS, getFID, etc... no longer worked
const reportWebVitals = (onPerfEntry?: ReportOpts) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(() => console.log(onPerfEntry), onPerfEntry);
      onFID(() => console.log(onPerfEntry), onPerfEntry);
      onFCP(() => console.log(onPerfEntry), onPerfEntry);
      onLCP(() => console.log(onPerfEntry), onPerfEntry);
      onTTFB(() => console.log(onPerfEntry), onPerfEntry);
    });
  }
};

export default reportWebVitals;
