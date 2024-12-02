const createDataAndOptions = (label, data, bgColor, unit) => {
    const minValue = Math.min(...data) - Math.floor(0.5 * Math.min(...data));
    const maxValue = Math.max(...data) + Math.floor(0.5 * Math.min(...data));
    return {
      data: {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [{ label, data, backgroundColor: bgColor, borderColor: '#FFFFFF', borderWidth: 0 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, labels: { color: 'white' } },
          title: { display: false, text: label, color: 'white' },
        },
        scales: {
          x: {
            ticks: { color: 'white' },
            grid: { color: 'rgba(255,255,255,0.3)', lineWidth: 3 },
          },
          y: {
            ticks: {
              color: 'white',
              callback: (value) => `${value} ${unit}`,
            },
            grid: { color: 'rgba(255,255,255,0.8)', lineWidth: 3 },
            min: minValue,
            max: maxValue,
          },
        },
      },
    };
  };
  
  export const { data: data1, options: options1 } = createDataAndOptions(
    'Body Weight Title',
    [165, 175, 180, 185, 190, 190, 190],
    '#FFFFFF',
    'lb'
  );
  
  export const { data: data3, options: options3 } = createDataAndOptions(
    'Workout Duration',
    [1.4, 1, 1.1, 1, 1, 1.2, 1],
    'skyblue',
    'hr'
  );
  