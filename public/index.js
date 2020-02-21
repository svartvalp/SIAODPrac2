google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      async function drawChart() {
          let dataArray = [['Дата', 'Значение', 'SMA10', 'SMA100']]
          let responce = await fetch('http://localhost:8080/api/rate', {
              method : 'GET'
          })
          let fetched = await responce.json()
          if(fetched.data) {
           dataArray = [[]]
          }
          if(fetched.data[0].length == 3) {
            dataArray = [['Дата','Значение','SMA10']]
          }
          if(fetched.data[0].length == 4) {
            dataArray = [['Дата','Значение','SMA10', 'SMA100']]
          }
          dataArray = dataArray.concat( fetched.data)
          console.log(dataArray)
        var data = google.visualization.arrayToDataTable(dataArray);
        var options = {
          title: 'Курс фунт/рубль',
          hAxis: {title: 'Дата',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }

      async function changeChart() {
        let step = 'day'
        var rad=document.getElementsByName('step');
        for (var i=0;i<rad.length; i++) {
            if (rad[i].checked) {
              step = rad[i].value
            }
        }
        if((document.getElementById('from_year').value > document.getElementById('to_year').value)
         || ((document.getElementById('from_year').value == document.getElementById('to_year').value)
          && (document.getElementById('from_month').value > document.getElementById('to_month').value))) {
            alert('Начальная дата больше конечной!')
            return
          }
        let dataArray = [['Дата', 'Значение']]
        let from = document.getElementById('from_year').value +'-'+document.getElementById('from_month').value + '-01'
        let lastDay = new Date(document.getElementById('to_year').value, document.getElementById('to_month').value, 0)
        let to = document.getElementById('to_year').value +'-'+document.getElementById('to_month').value + '-' + lastDay.getDate()
        let url = 'http://localhost:8080/api/rate?from=' + from + "&to=" +to
        if(step != 'day') {
          url = 'http://localhost:8080/api/rate?from=' + from + "&to=" +to + "&step=" + step
        }        
        let responce = await fetch(url, {
          method : 'GET'
        })
        let fetched = await responce.json()
        if(!fetched.data) {
         dataArray = [[]]
        }
        if(fetched.data[0].length == 3) {
          dataArray = [['Дата','Значение','SMA10']]
        }
        if(fetched.data[0].length == 4) {
          dataArray = [['Дата','Значение','SMA10', 'SMA100']]
        }
        dataArray = dataArray.concat( fetched.data)
        console.log(dataArray)
       var data = google.visualization.arrayToDataTable(dataArray);
        var options = {
        title: 'Курс фунт/рубль',
        hAxis: {title: 'Дата',  titleTextStyle: {color: '#333'}},
        vAxis: {minValue: 0}
       };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
      }