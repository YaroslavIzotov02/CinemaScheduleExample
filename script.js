var curt = 1;
var counter = 0;
var dateNow = new Date("2024-03-25");
var dict;
var IDs = new Array('');
var SIDs = [];
var filNS = new Array('');
const imgdict = {
    zerocond: 'zero condition for initialization'
}

const Days = { 0: 'Воскресенье', 1: 'Понедельник', 2: 'Вторник', 3: 'Среда', 4: 'Четверг', 5: 'Пятница', 6: 'Суббота' };

function DateChange(n) {
    var temp1 = n * 86400000;
    var dateNotNow = new Date(dateNow.getTime() + temp1);
    dateNow.setTime(dateNotNow.getTime());
    $(function () {
       for (var i = 1; i < 8; i++)
       {
            var temp2 = dateNotNow.getTime() +  (i - 1) * 86400000;
            var temp = new Date(temp2);
            $("#dmb" + i).children("h1").html(temp.toLocaleDateString('default', { day: '2-digit', month: 'long' }) + `<br \/>` + Days[temp.getDay()]);
       }
    })
};

function DateAdd(n) {
    let temp1 = n * 86400000;
    let dateNotNow = new Date(dateNow.getTime() + temp1);
    return dateNotNow;
    
};


function bind() {
    const SIZE = 7;
    for(let i = 1; i < SIZE + 1; ++i) {
        $(function () {
            $("#dmb" + i).bind('click', function(e) {
            for(let j = 1; j < SIZE + 1; ++j) {
                $('#t' + j).children(".wrap").empty();
                if (j == i) continue;
                $("#dmb" + j).css('background-color', 'rgb(255, 255, 255)');
                $("#dmb" + j).css('color', 'rgb(0, 0, 0)');
                $("#t" + j).css('display', 'none');
            }
            
            $("#dmb" + i).css('background-color', 'rgb(14,25,255)');
            $("#dmb" + i).css('color', 'aliceblue');
            $("#t" + i).css('display', 'flex');
            curt = i;
            getFilms(DateAdd(i-1));
            })
        });
    }
};

bind();

$(function () {
    $(".addbtn").bind("click", function(e) {

        for (let i = 1; i < filNS.length; i++)
        {
            $("#filmnamesss").append(`<option value="${filNS[i]}">${filNS[i]}</option>`);
        }

       $(".addform").css("display", "flex");

    });
    $("#submit").bind("click", function(e) {
        ++counter;
        $('#t' + curt).children(".wrap").append(
        `<div class="filmcard" id="fc${counter}">
        <div class="imgholder" id="imgh${counter}">
        <img id="img${counter}" src = "placeholder.png"/>
        </div>
        <div class="filminfo" id="info">
            <h2 id="h2name">${$('#filmname').val()}</h2>
            <h3>${$('#filmrating').val()} +</h3>
            <p>${$('#filmgenres').val()}</p>
            <h4>${$('#filmlasting').val()} мин.</h4>
            <p id="times"></p>
            
        </div>
        <div class="filmctrl" id="ctrl${counter}">
            <button class="deletebtn">X</button>
            <button class="chngbtn">C</button>
            <button class="imgbtn">i</button>
        </div>
    </div>`);
    $("#img" + counter).css("width", "100%");
    $("#img" + counter).css("height", "100%");
    $("#img" + counter).css("object-fit", "contain");


    let filmstruct = {
    "name": $('#filmname').val(),
    "duration": Number($('#filmlasting').val()),
    "age": Number($('#filmrating').val()),
    "genres": $('#filmgenres').val().split(", ")
    }

 fetch(`http://localhost:8000/api/film/new`,
    {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
        body: JSON.stringify(filmstruct)
    }).then(function (response) {
        console.log(filmstruct)
        return response.json();
      })
      .then(function (data) {
        IDs.push(data.id);
      });    

    $(".addform").css("display", "none");
    $("#filmnamesss").empty();
    });
    $("#cancel").bind("click", function(e) {
    {
    $(".addform").css("display", "none");
    alert("Добавление карточки фильма отменено!");
    $("#filmnamesss").empty();
    }
    });
});

$(function () {
    $(".delfbtn").bind("click", function(e) {

        for (let i = 1; i < filNS.length; i++)
        {
            $("#filmdel").append(`<option value="${filNS[i]}">${filNS[i]}</option>`);
        }

       $(".delfilm").css("display", "flex");
    });
    $("#submit4").bind("click", function(e) {
    {

        if (!($('#filmdel').has('option').length === 0)) { 
            if (confirm("Вы действительно хотите удалить фильм?")) {
                let tmp = $("#filmdel option:selected").val();
                $(`#h2name:contains(${tmp})`).remove();
                let ind = filNS.indexOf(tmp);
                if (ind != -1)
                {
                    filNS.splice(ind, 1);
                }
        
                let flmdel = {
                    "name": tmp
                }
                
                console.log(JSON.stringify(flmdel));

        fetch(`http://localhost:8000/api/film/remove`,
        {
            mode: 'cors',
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(flmdel)
            
        }).then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('deldata', data);
            location.reload();
        });
                
            }
            else {
               alert("Удаление фильма отменено!");
               location.reload();
            }
        }   

    $(".delfilm").css("display", "none");
    $("#filmdel").empty();
    }
    });
    $("#cancel4").bind("click", function(e) {
    {
    $(".delfilm").css("display", "none");
    alert("Удаление фильма отменено!");
    $("#filmdel").empty();
    location.reload();
    }
    });
});

$(function () {

    $(document).on('click', '.chngbtn', function(e) {
        
        let tmp = Number($(this).closest('.filmctrl').attr('id').replace('ctrl', ''));

        $(".addsess").css("display", "flex");

        $("#submit2").bind("click", function(e) {
        {
        
            let sessionstruct = {
                "film_id": IDs[tmp],
                "date" : DateAdd(curt-1).toISOString().split('T')[0] + 'T' + $('#filmtime').val() + ':00'
            };

            

            if ($("#fc"+tmp).children("#info").children("#times").text() != '')
            {
                $("#fc"+tmp).children("#info").children("#times").text($("#fc"+tmp).children("#info").children("#times").text() + ', ' + `${$('#filmtime').val()}`);
                let tmp2 = $("#fc"+tmp).children("#info").children("#times").text().split(', ');
                tmp2.sort();
                $("#fc"+tmp).children("#info").children("#times").text(tmp2.join(', '));
            }
            else 
            {
                $("#fc"+tmp).children("#info").children("#times").text(`${$('#filmtime').val()}`);
            }
            
            let ts = {
                time: $('#filmtime').val(),
                sesid: '',
                filmid: IDs[tmp]
            }

        $(".addsess").css("display", "none");
        fetch(`http://localhost:8000/api/session/new`,
        {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
                },
        body: JSON.stringify(sessionstruct)
        }).then(function (response) {
            return response.json();
        })
        .then(function (data) {
            ts.sesid = data.id;
            location.reload();
        });
        SIDs.push(ts);
        }
        });
        $("#cancel2").bind("click", function(e) {
        {
        $(".addsess").css("display", "none");
        alert("Добавление сессии отменено!");
        location.reload();
        }
        });
    })
});

$(function () {

    $(document).on('click', '.imgbtn', function(e) {
        
        var tmp = Number($(this).closest('.filmctrl').attr('id').replace('ctrl', ''));

        let fid = IDs[tmp];

        $(".addimg").css("display", "flex");

        $("#submit5").bind("click", function(e) {
        {
        
            const fileInput = document.getElementById('filmcover');
            const file = fileInput.files[0];
            var imres;

            if (file.size) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imgBase64 = event.target.result;
                    imres = imgBase64.replace('data:image/png;base64,', '');
                }

                reader.onloadend = function(event) {
                    console.log(imres);
                fetch(`http://localhost:8000/api/film/${fid}/preview`,
                {
                    mode: 'cors',
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: JSON.stringify({
                        "data":  imres
                    })
                }).then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log('imdata', data);
                    location.reload();
                });
            }
            reader.readAsDataURL(file);
            };
        }    
            $(".addimg").css("display", "none");
    });
            $("#cancel5").bind("click", function(e) {
            {
            $(".addimg").css("display", "none");
            alert("Добавление обложки отменено!");
            location.reload();
            }
        });
    })
});

$(function () {
   $(document).on('click', '.deletebtn', function(e) {
    
    let tmpnum = Number($(this).closest('.filmctrl').attr('id').replace('ctrl', ''));
    let partimes = $("#fc"+tmpnum).children("#info").children("#times");
    for (let j = 0; j < SIDs.length; j++)
        {
            console.log(SIDs[j].filmid);
        if ((SIDs[j].filmid == IDs[tmpnum]))
            {    
                $("#sesdel").append(`<option value="${SIDs[j].time}">${SIDs[j].time}</option>`);
            }
        }
    
        $(".delsess").css("display", "flex");

        $("#submit3").bind("click", function(e) {
        {

            if (!($('#sesdel').has('option').length === 0)) { 
                if (confirm("Вы действительно хотите удалить сессию?")) {
                    let tmp = $("#sesdel option:selected").val();
                    let temptimes = partimes.text().split(', ');
                    temptimes.splice(temptimes.indexOf(tmp), 1);
                    partimes.text(temptimes.join(', '));
                    
                    let stmp;

                    for (let i = 0; i < SIDs.length; i++)
                    {
                        if ((SIDs[i].time == tmp)&&(SIDs[i].filmid == IDs[tmpnum]))
                        {    
                            stmp = SIDs[i].sesid;
                        }
                    }           
                    
            fetch(`http://localhost:8000/api/session/${stmp}/remove`,
            {
                mode: 'cors',
                method: 'DELETE'
                
            }).then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('sesdeldata', data);
                location.reload();
            });
                }
                else {
                   alert("Удаление сессии отменено!");
                   location.reload();
                }
            } 

        $(".delsess").css("display", "none");
        $("#sesdel").empty();
        }
        });
        $("#cancel3").bind("click", function(e) {
        {
        $(".delsess").css("display", "none");
        alert("удаление сессии отменено!");
        $("#sesdel").empty();
        location.reload();
        }
        });    
    })
});


function imgToBase64(img) {
    let reader = new FileReader();
    reader.readAsDataURL(img);
    return reader.result;
}


function getFilms(dateee) {
    fetch(`http://localhost:8000/api/films?date=${dateee.toISOString().split('T')[0]}`,
    {
        mode: 'cors',
        method: 'GET' 
    }
    ).then(function (response) {
        return response.json();
      })
      .then(function (data) {
        dict = data;
        var filmslist = dict.films;
        var sessionslist = dict.sessions;
        console.log (sessionslist);

        for(let key02 of Object.keys(sessionslist)) {
        let ts = {
            time: sessionslist[key02].time,
            sesid: sessionslist[key02].id,
            filmid: sessionslist[key02].film_id
        }
        SIDs.push(ts);            
        }

        for(let key of Object.keys(filmslist)) {
            let film = filmslist[key];
            IDs.push(key);
            ++counter;
            $('#t' + curt).children(".wrap").append(
                `<div class="filmcard" id="fc${counter}">
                    <div class="imgholder" id="imgh${counter}">
                        <img id="img${counter}" src = "placeholder.png"/>
                    </div>
                    <div class="filminfo" id="info">
                        <h2 id="h2name">${film.name}</h2>
                        <h3>${film.age}+</h3>
                        <p>${film.genres.join(", ")}</p>
                        <h4>${film.duration} мин.</h4>
                        <p id="times"></p>
                    </div>
                    <div class="filmctrl" id="ctrl${counter}">
                        <button class="deletebtn">X</button>
                        <button class="chngbtn">C</button>
                        <button class="imgbtn">i</button>
                    </div>
                </div>`);
            $("#img" + counter).css("width", "100%");
            $("#img" + counter).css("height", "100%");
            $("#img" + counter).css("object-fit", "contain");
            let tmstr = '';
            for(let key2 of Object.keys(sessionslist)) {
                    let session = sessionslist[key2];
                    if(session.film_id == key) 
                    {    
                        if (tmstr != '') 
                        {
                            tmstr = tmstr + ', ' + session.time;
                            let tmpses = tmstr.split(', ');
                            tmpses.sort();
                            tmstr = tmpses.join(', ');

                        }
                        else
                        {
                        tmstr = tmstr + session.time;
                        }
                        $("#fc"+counter).children("#info").children("#times").text(tmstr);
                        
                    }
                }
            }
            
            for (let s = 1; s < IDs.length; s++) {
                if (IDs[s] in imgdict)
                {
                    $('#img' + s).attr('src', 'data:image/png;base64,' + imgdict[IDs[s]]);
                }
                else
                {
                    try{
                    fetch(`http://localhost:8000/api/film/${IDs[s]}/preview`,
                    {
                        mode: 'cors',
                        method: 'GET' 
                    }
                    ).then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        var img = data.data;
                        $('#img' + s).attr('src', 'data:image/png;base64,' + img);
                        imgdict[IDs[s]] = img; 
                    })
                    }
                    catch {
                        $('#img' + s).attr('src', 'placeholder.png');
                    }
                }
            }
            console.log(imgdict);
        })
}

function getAllFilms() 
{
    fetch(`http://localhost:8000/api/films/all`,
    {
        mode: 'cors',
        method: 'GET' 
    }
    ).then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log('data', data);
        dict = data;
        filNS = dict.names;
        })
}

$(function () {
    $(document).on('load', 'window', DateChange(0));
    getFilms(dateNow);
    getAllFilms();
})

$(function () {
    $(".l").bind("click", function (e) {
        $(".btn").css("animation", "1.5s fin");
        $(".btn").on('animationend', function () {
            $(".btn").css("animation", "");
        })

        curt++;
        if (curt > 7)
            curt = 7;
        
            for(let j = 1; j < 8; ++j) {
                if (j == curt) continue;
                $("#dmb" + j).css('background-color', 'rgb(255, 255, 255)');
                $("#dmb" + j).css('color', 'rgb(0, 0, 0)');
                $("#t" + j).css('display', 'none');
            }
            console.log(curt);
            $("#dmb" + curt).css('background-color', 'rgb(14,25,255)');
            $("#dmb" + curt).css('color', 'aliceblue');
            $("#t" + curt).css('display', 'flex');

        DateChange(-1);
        $("#dmb" + curt).trigger('click');
    })

    $(".r").bind("click", function (e) {
        $(".btn").css("animation", "1.5s fin");
        $(".btn").on('animationend', function () {
            $(".btn").css("animation", "");
        })

        curt--;
        if (curt < 1)
            curt = 1;
        
            for(let j = 1; j < 8; ++j) {
                if (j == curt) continue;
                $("#dmb" + j).css('background-color', 'rgb(255, 255, 255)');
                $("#dmb" + j).css('color', 'rgb(0, 0, 0)');
                $("#t" + j).css('display', 'none');
            }
            console.log(curt);
            $("#dmb" + curt).css('background-color', 'rgb(14,25,255)');
            $("#dmb" + curt).css('color', 'aliceblue');
            $("#t" + curt).css('display', 'flex');

        DateChange(1);
        $("#dmb" + curt).trigger('click');
    })
})

$(function () {
    $(document).on('click', '.printbtn', function ()
    {
        for(let j = 1; j < 8; ++j) {
            if (j == curt)
            {
                $('#dmb' + j).css('display', 'block');
                $('#dmb' + j).css('color', 'black');                 
            }
            else
            {
                $('#dmb' + j).css('display', 'none');
            }
        }
        window.print();
        location.reload(true);
    })
})