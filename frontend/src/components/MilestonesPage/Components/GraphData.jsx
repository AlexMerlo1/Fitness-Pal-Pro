

export const data1 = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Body Weight Title',
        data: [165, 175, 180, 185, 190, 190, 190],
        backgroundColor: '#FFFFFF', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };
const minValue = Math.min(...data1.datasets[0].data) - Math.floor(.5*Math.min(...data1.datasets[0].data)) // Small buffer below the minimum
const maxValue = Math.max(...data1.datasets[0].data) + Math.floor(.5*Math.min(...data1.datasets[0].data))// Small buffer above the maximum

export const options1 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white', // Legend label color
            },
        },
        title: {
            display: false,
            text: 'Body Weight',
            color: 'white', // Title color
        },
    },
    scales: {
        x: {
            ticks: {
                color: 'white', // X-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.3)', // X-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
                callback: function (value) {
                    return `${value} lb`; // Add 'lb' to the tick labels
                },
            },
            grid: {
                color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
            min: minValue,
            max: maxValue,
        },
    },
};

export const data2 = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Daily Step Count Title',
        data: [9_000, 10_000, 8_000, 11_000, 15_000, 13_000, 7_000],
        backgroundColor: 'orange', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };

  const minValue2 = Math.min(...data2.datasets[0].data) - Math.floor(.5*Math.min(...data2.datasets[0].data)) // Small buffer below the minimum
  const maxValue2 = Math.max(...data2.datasets[0].data) + Math.floor(.5*Math.min(...data2.datasets[0].data))// Small buffer above the maximum
  

export const options2 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white', // Legend label color
            },
        },
        title: {
            display: false,
            text: 'Daily Step Count',
            color: 'white', // Title color
        },
    },
    scales: {
        x: {
            ticks: {
                color: 'white', // X-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.3)', // X-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
            min: minValue2,
            max: maxValue2
        },
    },
};

export const data3 = {
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thurday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Workout Duration',
        data: [1.4, 1, 1.1, .9, .8, 1.2, 1],
        backgroundColor: 'skyblue', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };

  const minValue3 = Math.min(...data3.datasets[0].data) - Math.round(.5*10*Math.min(...data3.datasets[0].data))/10 // Small buffer below the minimum
  const maxValue3 = (Math.max(...data3.datasets[0].data) + (Math.floor(.5*10*Math.min(...data3.datasets[0].data))/10)).toFixed(2)// Small buffer above the maximum
  

export const options3 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: true,
            labels: {
                color: 'white', // Legend label color
            },
        },
        title: {
            display: false,
            text: 'Workout Duration',
            color: 'white', // Title color
        },
    },
    scales: {
        x: {
            ticks: {
                color: 'white', // X-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.3)', // X-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
                callback: function (value) {
                    return `${value} hr`; // Add 'lb' to the tick labels
                },
            },
            grid: {
                color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
            min: minValue3,
            max: maxValue3
        },
    },
};

export const data4 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'data4',
        data: [30, 25, 30, 25, 30, 25],
        backgroundColor: '#FFFFFF', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };

export const options4 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                color: 'white', // Legend label color
            },
        },
        title: {
            display: true,
            text: 'Data4 Title',
            color: 'white', // Title color
        },
    },
    scales: {
        x: {
            ticks: {
                color: 'white', // X-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.3)', // X-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
    },
};

export const data5 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'weight',
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: '#FFFFFF', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };

export const options5 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                color: 'white', // Legend label color
            },
        },
        title: {
            display: true,
            text: 'Data5 Title',
            color: 'white', // Title color
        },
    },
    scales: {
        x: {
            ticks: {
                color: 'white', // X-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.3)', // X-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
    },
};

export const data6 = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'weight',
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: '#FFFFFF', // Bar fill color
        borderColor: '#FFFFFF', // Bar border color
        borderWidth: 0, // Thickness of bar borders
      },
    ],
  };

export const options6 = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                color: 'white', // Legend label color
            },
        },
        title: {
            display: true,
            text: 'Data6 Title',
            color: 'white', // Title color
        },
    },
    scales: {
        x: {
            ticks: {
                color: 'white', // X-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.3)', // X-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
        y: {
            ticks: {
                color: 'white', // Y-axis label color
            },
            grid: {
                color: 'rgba(255,255,255,0.8)', // Y-axis gridline color
                lineWidth: 3, // Thickness of grid
            },
        },
    },
};