// Author: Jacob Veber
// Email: jacob_veber@student.uml.edu

$(function() {
  // Display Slider values and two-way binding
  $('.slider').each(function () {
    $(this).slider({
        min: -50, max: 50, value: 0,
        create: function() {
          $(this).find('.ui-slider-handle').text($(this).slider("value"));
          $(this).prev('.slider-value').val( $(this).slider("value") );
        },
        slide: function( event, ui ) {
          $(this).find('.ui-slider-handle').text( ui.value );
          $(this).prev('.slider-value').val( ui.value );
        }
      });
  });
  $(".slider-value").each(function () {
    $(this).change(function() {
      $(this).next('.slider').slider("option", "value", $(this).val());
      $(this).next('.slider').find('.ui-slider-handle').text( $(this).val());
    });
  });

  // Create where to throw tabs
  $( "#tabs" ).tabs();
  var tabCounter = 0;

  function newTab(minX, maxX, minY, maxY) {
    // Tab ID
    tabCounter++;

    // Add Tab Label
    $("#tabs-nav").append(
      "<li><a href='#tab" + tabCounter + "'>[" + minX + ", " + maxX + "] x [" + minY + ", " + maxY + "]</li>"
    );

    // Add Tab table container
    $("#tabs").append(
      "<div id='tab" + tabCounter + "'></div>"
    );

    // Refresh Added tabs
    $("#tabs").tabs("refresh");

    // Open the new tab
    $("#tabs-nav").find('a[href="#tab' + tabCounter + '"]').trigger("click");
  };

  // Create function to determine when max is greater than min
  jQuery.validator.addMethod("greater",
      function (value, element, param) {
          var other = $(param);
          return parseInt(value, 10) > parseInt(other.slider("option", "value"), 10);
      }
  );

  // jQuery validation
  $("#mult-form").validate({
    rules: {
      minX: {
         range: [-50, 50]
      },
      maxX:  {
        required: true,
        range: [-50, 50],
        greater: "#minX-slider"
      },
      minY: {
        required: true,
        range: [-50, 50]
      },
      maxY:  {
        required: true,
        range: [-50, 50],
        greater: "#minY-slider"
      }
    },
    messages: {
      maxY: {
        greater: "Enter a Max Y greater than the Min Y."
      },
      maxX: {
        greater: "Enter a Max X greater than the Min X."
      }
    },
    // Place error after slider & color it yellow
    errorPlacement: function(error, element) {
        error.addClass("text-warning")
        error.insertAfter(element.next());
    },
    // On valid generate multiplaction table
    submitHandler: function(form) {
      if ($("#mult-form").valid()) {

        var minY = $("#minY-slider").slider("option", "value");
        var maxY = $("#maxY-slider").slider("option", "value");
        var minX = $("#minX-slider").slider("option", "value");
        var maxX = $("#maxX-slider").slider("option", "value");

        newTab(minX, maxX, minY, maxY);

        // Create Table
        var table = document.createElement("table");
        table.classList.add('table');
        table.classList.add('table-striped');

        for (let i = 0; i <= maxY - minY + 1; i++) {
          // Iterate through rows
          var row = table.insertRow(i);

          for (let j = 0; j <= maxX - minX + 1; j++) {
            // Iterate through collumns
            var col = row.insertCell(j);

            if (i == 0 && j == 0) {
              // Corner Element
              col.innerHTML = "#";
              col.style.fontWeight = "bold";
            } else if (i == 0) {
              // Fill Top Headers
              col.innerHTML = parseInt(minX) + j - 1;
              col.style.fontWeight = "bold";
            } else if (j == 0) {
              // Fill Left Headers
              col.innerHTML = parseInt(minY) + i - 1;
              col.style.fontWeight = "bold";
            } else {
              // Multiply rows by collumns
              col.innerHTML = (parseInt(minY) + i - 1) * (parseInt(minX) + j - 1);
            }

            col.style.width = '100px';

          }


        }
        $("#tab" + tabCounter).append(table);

        // Prevent page redirect
        return false;
      }
    }
  });
});
