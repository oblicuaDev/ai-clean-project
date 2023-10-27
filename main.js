var candidates = [
  {
    name: "Prueba 1",
    source: "cha_4LASNog82VarlZgsNJ9sZ",
    avatar: "https://placehold.co/600x400",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  newChat(0);
});

var currentMan = {};
var rows = [];

function newChat(id) {
  $("#themsg").focus();
  $("#theform").show();
  if ($(window).width() < 770) {
    $("html, body").animate({ scrollTop: $("#chatheader").offset().top }, 400);
  }
  $(".man").removeClass("active");
  currentMan = candidates[id];
  $("#history").html("");
  setMSG(
    `Estas chateando con ${currentMan.name} . Haz preguntas y aclara tus dudas antes del 29 de Octubre. Recuerda que esta es una herramienta gratuita e informativa y no reemplaza la lectura del plan de gobierno completo.`,
    1
  );
  $("#current-man").html(`Plan de Gobierno de ${currentMan.name}`);
  $("#current-avatar").attr("src", currentMan.avatar);
  $("#cand-" + id).addClass("active");
}
function setMSG(c, p) {
  $(".susp").hide();
  if (p == 2) {
    var element = `<li class="clearfix"><div class="message-data susp text-right"><img src="${currentMan.avatar}" alt="avatar"> </div> <div class="susp message other-message float-right">${c}</div></li>`;
  } else if (p == 1) {
    var element = `<li class="clearfix"><div class="message-data text-right"><img src="${currentMan.avatar}" alt="avatar"> </div> <div class="message other-message float-right" style="text-align:left;">${c}</div></li>`;
  } else {
    var element = `<li class="clearfix"><div class="message-data"></div><div class="message my-message">${c}</div></li>`;
  }

  $("#history").append(element);
  $("#chat-history").animate({ scrollTop: $("#history").height() }, 300);
}
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

$(document).ready(function () {
  candidates = shuffle(candidates);
  setCredits("#bc1ef9", "eligeaicredits");

  for (var i = 0; i < candidates.length; i++) {
    var element = `<li class="clearfix man" data-candidate="${i}" id="cand-${i}" ><img src="${candidates[i].avatar}" alt="avatar"><div class="about"><div class="name">${candidates[i].name} </div><div class="status"> <i class="fa fa-circle online"></i> online </div></div> </li>`;
    $("#chatlist").append(element);
  }
  $(".man").click(function () {
    newChat($(this).data("candidate"));
  });
  //newChat(0);

  $("form").on("submit", function (e) {
    e.preventDefault(); // prevent native submit
    var msg = $("#themsg").val();
    var msgObject = [];
    msgObject.push({
      role: "user",
      content: `${msg}. Explicalo en lenguaje sencillo para personas sin conocimientos y en tono amigable.`,
    });

    var entity = {
      url: "https://api.chatpdf.com/v1/chats/message",
      method: "POST",
      timeout: 0,
      headers: {
        "x-api-key": "API_KEY_CHATPDF",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        sourceId: currentMan.source,
        messages: msgObject,
      }),
    };
    $("form")[0].reset();
    setMSG(msg, 0);
    setMSG("escribiendo...", 2);
    //console.log(entity);
    $.ajax(entity).done(function (response) {
      console.log(response);
      msgObject.push({
        role: "assistant",
        content: response.content,
      });
      setMSG(response.content, 1);
    });
  });
});
