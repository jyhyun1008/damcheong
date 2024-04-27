var LANG
if (LANGUAGE == 'ko-KR') {
    LANG = koKR
} else {
    LANG = koKR // Default Language
}

var MISSKEYID = localStorage.getItem('misskeyId')

const token = localStorage.getItem("token")
const signedusername = localStorage.getItem("username")
const sessionId = localStorage.getItem("sessionId")
var jsonPageId = localStorage.getItem("jsonPageId")

var cssRoot = document.querySelector(':root');
cssRoot.style.setProperty('--accent', THEMECOLOR)
cssRoot.style.setProperty('--darkaccent', 'color-mix(in srgb, var(--accent) 70%, #470046)')
cssRoot.style.setProperty('--lightaccent', 'color-mix(in srgb, var(--accent) 70%, #fbffbb)')
cssRoot.style.setProperty('--opacityaccent', 'color-mix(in srgb, var(--darkaccent), transparent 40%)')
cssRoot.style.setProperty('--bgaccent', 'color-mix(in srgb, var(--darkaccent), transparent 20%)')

document.querySelector('#infonav').innerText = LANG.INFO
document.querySelector('#collectionnav').innerText = LANG.COLLECTION

var background = document.querySelector('#background');
background.style.backgroundImage = 'url('+BACKIMGURL+')'

var fileCount = {
    l: 0
}

var isLogin = false;
if (sessionId) {
    isLogin = true;
    if (location.href.includes('?')) {
        document.querySelector('.nav-box').innerHTML += '<div class="nav-list"><a href="'+location.href+'&mode=edit">'+LANG.EDIT+'</a></div>'
    } else {
        document.querySelector('.nav-box').innerHTML += '<div class="nav-list"><a href="./?mode=edit">'+LANG.EDIT+'</a></div>'
    }
}

var example = {
    "info": {
        "title": "CabinetKey",
        "subTitle": "캐비닛키",
        "summary": "",
        "description": "마크다운과 개행을 지원하는 긴 소개글",
        "yearRange": [0, 100],
        "mainYear": [0],
        "defaultYear": 0,
        "map": "https://peachtart2.s3.ap-northeast-1.amazonaws.com/tart/c973e2de-8986-4fcd-8f0e-c4ab74ac7d67.webp",
        "mainHashtag": "CabinetKey",
        "hashtags": ["CabinetKey"]
    },
    "character": {
        "category": [""],
        "list": [
            {
                "avatar": "https://peachtart2.s3.ap-northeast-1.amazonaws.com/tart/6f0f78c1-bd3f-4732-9c62-15ae451c2257.png",
                "name": "캐릭터 1",
                "meaning": "",
                "nickname": {
                    "별명": "",
                    "애칭": ""
                },
                "birthday": "",
                "lived": [0, 50],
                "category": "",
                "subCategory": "",
                "eventChronology": {
                    "0.0": "",
                    "0.0": "",
                    "0.0": ""
                },
                "positionChronology": {
                    "0.0": "",
                    "0.0": ""
                },
                "relatedTo": {
                    "분류1": [0],
                    "분류2": [0]
                },
                "goal": ["", ""],
                "themeSong": [0],
                "summary": "짧은 요약",
                "description": "마크다운과 개행을 지원하는 긴 소개글",
                "secret": "",
                "hashtag": "CabinetKey"
            }
        ]
    },
    "world": {
        "0,0": {
            "0,50": {
                "name": "장소 1(이전 지명)",
                "image": "",
                "summary": "간단 요약",
                "description": "마크다운과 개행을 지원하는 긴 소개글",
                "eventChronology": {
                    "0": ""
                },
                "relatedTo": {
                    "분류1": [0]
                }
            }, 
            "50,100": {
                "name": "장소 1(변경된 지명)",
                "image": "",
                "summary": "간단 요약",
                "description": "마크다운과 개행을 지원하는 긴 소개글",
                "eventChronology": {
                    "50": ""
                },
                "relatedTo": {
                    "분류1": [0]
                }
            }
        },
        "9,9": {
            "0,100": {
                "name": "장소 2",
                "image": "",
                "summary": "간단 요약",
                "description": "마크다운과 개행을 지원하는 긴 소개글",
                "eventChronology": {
                    "0": ""
                },
                "relatedTo": {
                    "분류1": [0]
                }
            }
        }
    },
    "themeSong": [
        {
            "embed": "",
            "title": "테마곡 1",
            "artist": "Various Artist",
            "relatedTo": [0],
            "summary": "간단 요약",
            "description": "마크다운과 개행을 지원하는 긴 소개글",
            "lyrics": "마크다운과 개행을 지원하는 가사란"
        }
    ]
}

var json
if (localStorage.getItem('json')) json = JSON.parse(localStorage.getItem('json'))

//마크다운 파싱
function parseMd(md){

    md = "\n"+md+"\n\n"
    var md0 = md;

    md = md.replace(/\/g, '')

    md = md.replace(/\-\-\-/gm, 'ーーー')

    //checkbox
    md = md.replace(/\-\s\[x\]([^\[].+)/gm, '<div class="checkbox-container"><i class="bx bx-checkbox-square" ></i>$1</div>')
    md = md.replace(/\-\s\[\s\]([^\[].+)/gm, '<div class="checkbox-container"><i class="bx bx-checkbox" ></i>$1</div>')

    //ul
    md = md.replace(/^\s*\n\*\s/gm, '<ul>\n* ');
    md = md.replace(/\n\*\s(.+)\n\n/gm, '\n* $1\n</ul>\n\n');
    md = md.replace(/^\*\s(.+)/gm, '<li>$1</li>');
    while (md.includes('  * ')) {
        md = md.replace(/\<\/li\>\n\s\s\*\s/gm, '</li>\n<ul>\n  * ')
        md = md.replace(/\s\s\*\s(.+)\n\<\/ul\>/gm, '  \* $1\n</ul>\n</ul>')
        md = md.replace(/\s\s\*\s(.+)\n\<li\>/gm, '  \* $1\n</ul>\n<li>')
        md = md.replace(/\n\s\s\*\s(.+)/gm, '<li>$1</li>');
        md = md.replace(/\s\s\*\s/gm, '* ')
    }

    //ul
    md = md.replace(/^\s*\n\-\s/gm, '<ul>\n- ');
    md = md.replace(/\-\s([^\-]+)\n\n/gm, '* $1\n</ul>\n\n');
    md = md.replace(/^\-\s(.+)/gm, '<li>$1</li>');
    while (md.includes('  - ')) {
        md = md.replace(/\<\/li\>\n\s\s\-\s/gm, '</li>\n<ul>\n  - ')
        md = md.replace(/\s\s\-\s(.+)\n\<\/ul\>/gm, '  \- $1\n</ul>\n</ul>')
        md = md.replace(/\s\s\-\s(.+)\n\<li\>/gm, '  \- $1\n</ul>\n<li>')
        md = md.replace(/\n\s\s\-\s(.+)/gm, '<li>$1</li>');
        md = md.replace(/\s\s\-\s/gm, '- ')
    }
    md = md.replace(/([^\>]+)\n\<li\>/gm, '$1\n<ul>\n<li>')
    
    //ol
    md = md.replace(/^\s*\n\d\.\s/gm, '<ol>\n1. ');
    md = md.replace(/^(\d\.\s.+)\s*\n([^\d\.])/gm, '$1\n</ol>\n$2');
    md = md.replace(/^\d\.\s(.+)/gm, '<li>$1</li>');
    
    //blockquote
    md = md.replace(/^\>\s(.+)/gm, '<blockquote>$1</blockquote>');
    md = md.replace(/\<\/blockquote\>\<blockquote\>/gm, '\n\n');
    md = md.replace(/\<\/blockquote>\n<blockquote\>/gm, '\n\n');
    
    //h
    md = md.replace(/\n[\#]{6}\s(.+)/g, '<h6>$1</h6>');
    md = md.replace(/\n[\#]{5}\s(.+)/g, '<h5>$1</h5>');
    md = md.replace(/\n[\#]{4}\s(.+)/g, '<h4>$1</h4>');
    md = md.replace(/\n[\#]{3}\s(.+)/g, '<h3>$1</h3>');
    md = md.replace(/\n[\#]{2}\s([\s\S]+)[ー]{3}/g, '<div class="pflex">\n\#\# $1ーーー</div>');
    md = md.replace(/\n[\#]{2}(.+)[\:]{2}(.+)\n([^ー]+)[ー]{3}/g, '<div class="pgroup $2"><h2 class="pgroup-title">$1</h2><div class="pgroup-content">$3</div></div>');
    md = md.replace(/\n[\#]{2}(.+)\n([^ー]+)[ー]{3}/g, '<div class="pgroup"><h2 class="pgroup-title">$1</h2><div class="pgroup-content">$2</div></div>');
    md = md.replace(/\n[\#]{2}\s(.+)/g, '<h2>$1</h2>');
    md = md.replace(/\n[\#]{1}\s(.+)/g, '</div></div><div class="item_wrap"><div class="item"><h1 class="h1">$1</h1>');

    //hr
    md = md.replace(/[ー]{3}/g, '</div></div><div class="item_wrap"><div class="line">✿--✿--✿</div><div class="item">');
    
    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img src="$2" alt="$1" width="100%" /></a></div>');

    //images with width
    md = md.replace(/\!\[width\:([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" style="width:$1;" width="100%" />');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '<strong>$1</strong>');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');

    //주석
    md = md.replace(/\n[\/]{2}(.+)/g, '');
    
    //pre
    var mdpos = [];
    var rawpos = [];
    let pos1 = -1;
    let k = 0;

    var diff = [0]

    while( (pos1 = md0.indexOf('\n```', pos1 + 1)) != -1 ) { 
        if (k % 2 == 0){
            rawpos[k] = pos1 + 4;
        } else {
            rawpos[k] = pos1;
        }
        k++;
    }

    let pos2 = -1;
    let l = 0;

    while( (pos2 = md.indexOf('\n```', pos2 + 1)) != -1 ) { 
        if (l % 2 == 0){
            mdpos[l] = pos2 - 1;
        } else {
            mdpos[l] = pos2 + 5;
        }
        l++;
    }

    for (var i = 0; i < mdpos.length; i++){
        if (i % 2 == 0){
            md = md.replace(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]), '<pre class="code">'+md0.substring(rawpos[i], rawpos[i+1])+'</pre>');
            var mdSubStringLength = mdpos[i+1] - mdpos[i];
            var rawSubStringLength = rawpos[i+1] - rawpos[i] + '<pre class="code">'.length + '</pre>'.length;
            diff[i+2] = diff[i] + mdSubStringLength - rawSubStringLength;
        }
    }

    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');
    
    //br
    md = md.replace(/\n\n([^\n\n]+)\n\n/g, '\n<p>$1</p>');

    return md;
}

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject()
var page = qs.page
var year = qs.year
var category = qs.category
var note = qs.note
var mode = qs.mode
var qid = 0
var workqid = 0
var draftqid = 0
if (qs.qid && qs.qid.includes(',')) {
    workqid = parseInt(qs.qid.split(',')[0])
    draftqid = parseInt(qs.qid.split(',')[1])
} else if (qs.qid) {
    qid = parseInt(qs.qid)
}

if (page == 'signin') {
    if (!isLogin) {
        let uuid = self.crypto.randomUUID();
        localStorage.setItem("sessionId", uuid);
        var signinUrl = 'https://'+MISSKEYHOST+'/miauth/'+uuid+'?name=CabinetKey&callback='+encodeURIComponent(location.href.split('?')[0])+'%3Fpage%3Dcallback&permission=write:account,read:account,write:drive,write:notes,write:pages'
        location.href = signinUrl;
    } else {
        var willLogout = confirm(LANG.WILLYOULOGOUT)
        if (willLogout) {
            localStorage.clear()
            location.href = './'
        } else {
            alert(LANG.BACKTOMAINPAGE)
            location.href = './'
        }
    }
} else if (page == 'callback') {
    if (sessionId) {
        var postUrl = 'https://'+MISSKEYHOST+'/api/miauth/'+sessionId+'/check'
        var postParam = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({})
        }
        fetch(postUrl, postParam)
        .then((tokenData) => {return tokenData.json()})
        .then((tokenRes) => {
            if (tokenRes.user.username != MISSKEYUSER) {
                alert(LANG.cINVALIDID)
                localStorage.clear()
                location.href = './'
            } else {
                localStorage.setItem("token", tokenRes.token)
                var findInfoUrl = 'https://'+MISSKEYHOST+'/api/notes/search'
                var findInfoParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: 'CabinetKey_Setup',
                        userId: tokenRes.user.id,
                    })
                }
                fetch(findInfoUrl, findInfoParam)
                .then((infoData) => {return infoData.json()})
                .then((infoRes) => {
                    if (infoRes.length == 0) {
                        var jsonInitial = JSON.stringify(example)
                        var createPageUrl = 'https://'+MISSKEYHOST+'/api/pages/create'
                        var createPageParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                i: tokenRes.token,
                                title: 'CabinetKey.json',
                                name: 'CabinetKey.json',
                                summary: 'CabinetKey.json',
                                variables: [],
                                script: '',
                                content: [{
                                    text: '```\n'+jsonInitial+'\n```',
                                    type: 'text'
                                }]
                            })
                        }
                        fetch(createPageUrl, createPageParam)
                        .then((pageData) => {return pageData.json()})
                        .then((pageRes) => {
                            jsonPageId = pageRes.id
                            localStorage.setItem('json', jsonInitial)
                            localStorage.setItem('jsonPageId', jsonPageId)
                            var createNoteUrl = 'https://'+MISSKEYHOST+'/api/notes/create'
                            var createNoteParam = {
                                method: 'POST',
                                headers: {
                                    'content-type': 'application/json',
                                },
                                body: JSON.stringify({
                                    i: tokenRes.token,
                                    visibility: 'home',
                                    text: '`' + pageRes.id + '` #CabinetKey_Setup'
                                })
                            }
                            fetch(createNoteUrl, createNoteParam)
                            .then((noteData) => {return noteData.json()})
                            .then((noteRes) => {
                                location.href = './'
                            })
                        })
                    } else if (infoRes.length > 0) {
                        isLogin = true
                        location.href = './'
                    }
                })
            }
        })
    } else {
        alert('잘못된 접근입니다.')
        location.href = './'
    }
} 

function dataURLtoBlob(data) {
    var parts = data.split(',');
    var meta = parts[0].substring(5).split(';');
    var type = meta[0];
    var decoder = meta.indexOf('base64') !== -1 ? atob : decodeURIComponent;
    var bstr = decoder(parts[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: type });
}

function hoverWorld(coord, year) {
    var location = nowHere(coord, year)
    if (location) document.querySelector('.worldname').innerHTML = '[' + coord + ']' + location.data.name
}

function hoverCharacter(i) {
    document.querySelector('.charactername').innerHTML = '[' + i + ']' + json.character.list[i].name
}

function deleteFile(e) {
    if ('imgUploadFrame'+fileCount.l != e.id) {
        var isDeleting = confirm(LANG.cDELETEFILE)
        if (isDeleting) {
            e.remove()
            fileCount.l -= 1
        }
    }
}

document.querySelector('#refresh').addEventListener("click", (e) => {
    localStorage.removeItem('json')
    localStorage.removeItem('misskeyId')
})

function nowHere(coord, year) {
    var worldList = json.world[coord]
    if (worldList) {
        var worldPageYear = Object.keys(worldList)
        for (var i=0; i<worldPageYear.length; i++) {
            if (year >= parseInt(worldPageYear[i].split(',')[0]) && year <= parseInt(worldPageYear[i].split(',')[1])) {
                return {
                    "data": worldList[worldPageYear[i]],
                    "key": worldPageYear[i]
                }
            }
        }
    } else {
        return false
    }
}

function changeParam(MISSKEYID, query, limit, untilId='') {
    return new Promise((resolve) => {
        if (untilId == '') {
            resolve({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    userId: MISSKEYID,
                    limit: limit
                })
            })
        } else {
            resolve({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    userId: MISSKEYID,
                    limit: limit,
                    untilId: untilId
                })
            })
        }
    });
}

function changeArrayParam(query, limit, untilId='') {
    return new Promise((resolve) => {
        if (untilId == '') {
            resolve({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    limit: limit
                })
            })
        } else {
            resolve({
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    limit: limit,
                    untilId: untilId
                })
            })
        }
    });
}


async function fetchAgain(qid, hashtag, MISSKEYID = '') {

    if (MISSKEYID == '') {

        var fetchUrl = 'https://'+MISSKEYHOST+'/api/notes/search-by-tag'
        var fetchCount = 0
        var remainder = 0
        if (!qid || qid == 0) {
            return ''
        } else if (qid > 20) {
            fetchCount = Math.floor((qid * 5)/100)
            remainder = (qid * 5) % 100
        } else {
            remainder = qid * 5
        }
    
        var fetchParam = await changeArrayParam(hashtag, remainder)
    
        var data = await fetch(fetchUrl, fetchParam)
        var result = await data.json()
        var untilId = await result[remainder - 1].id
        if (fetchCount == 0) {
            return await untilId
        } else {
            var fetchParam2 = await changeArrayParam(hashtag, 100, untilId)
    
            for (var i=0; i<fetchCount; i++) {
                data = await fetch(fetchUrl, fetchParam2)
                result = await data.json()
                if (result.length < 100) {
                    break
                } 
                if (i == fetchCount - 1) {
                    return await result[99].id
                } else {
                    untilId = await result[99].id
                    fetchParam2 = await changeArrayParam(hashtag, 100, untilId)
                }
            }
        }

    } else {

        var fetchUrl = 'https://'+MISSKEYHOST+'/api/notes/search'
        var fetchCount = 0
        var remainder = 0
        if (!qid || qid == 0) {
            return ''
        } else if (qid > 20) {
            fetchCount = Math.floor((qid * 5)/100)
            remainder = (qid * 5) % 100
        } else {
            remainder = qid * 5
        }
    
        var fetchParam = await changeParam(MISSKEYID, hashtag, remainder)
    
        var data = await fetch(fetchUrl, fetchParam)
        var result = await data.json()
        var untilId = await result[remainder - 1].id
        if (fetchCount == 0) {
            return await untilId
        } else {
            var fetchParam2 = await changeParam(MISSKEYID, hashtag, 100, untilId)
    
            for (var i=0; i<fetchCount; i++) {
                data = await fetch(fetchUrl, fetchParam2)
                result = await data.json()
                if (result.length < 100) {
                    break
                } 
                if (i == fetchCount - 1) {
                    return await result[99].id
                } else {
                    untilId = await result[99].id
                    fetchParam2 = await changeParam(MISSKEYID, hashtag, 100, untilId)
                }
            }
        }
    }

}

function loadBackground(json) {

    document.querySelector('#world-content').innerHTML = '<div class="yearInput"><span class="bold">'+LANG.MOVETOYEAR+'</span> <input id="yearTextInput" placeholder="'+year+'" value="'+year+'"></input></div>'
    document.querySelector('.yearInput').innerHTML += ' <span class="bold" id="yearChange">'+LANG.MOVE+'</span>'
    document.querySelector('#world-content').innerHTML += '<div class="worldname"></div>'
    document.querySelector('#world-content').innerHTML += '<div class="worldmap"></div>'
    for (var i = 0; i < 11; i++){
        if (i == 0) {
            document.querySelector('.worldmap').innerHTML += '<div class="worldhead"></div>'
            for (var j = 0; j < 11; j++){
                if (j == 0) {
                    document.querySelector('.worldhead').innerHTML += '<div class="worldoriginhead"></div>'
                } else {
                    document.querySelector('.worldhead').innerHTML += '<div class="worldcolhead">'+(j-1)+'</div>'
                }
            }
        } else {
            document.querySelector('.worldmap').innerHTML += '<div class="worldrow" id="row'+(i-1)+'"></div>'
            for (var j = 0; j < 11; j++){
                if (j == 0) {
                    document.querySelector('#row'+(i-1)).innerHTML += '<div class="worldrowhead">'+(i-1)+'</div>'
                } else {
                    document.querySelector('#row'+(i-1)).innerHTML += '<a href="./?page='+(j-1)+','+(i-1)+'&year='+year+'" onmouseover="hoverWorld(`'+(j-1)+','+(i-1)+'`,'+year+')" class="worldcol" style="background-image: url('+json.info.map+')" id="col'+(j-1)+(i-1)+'">'+(j-1)+','+(i-1)+'</a>'
                }
            }
        }
    }
    document.querySelector('#character-content').innerHTML = '<div class="charactername"></div>'
    document.querySelector('#character-content').innerHTML += '<div class="characterlist"></div>'
    var cList = json.character.list
    if (!category) {
        var cCategory = json.character.category
        for (var j = 0; j < cCategory.length; j++) {
            document.querySelector('#character-content').innerHTML += '<div class="charactercategory" id="category'+j+'"><a href="./?category='+cCategory+'">'+cCategory[j]+'</a></div>'
            document.querySelector('#character-content').innerHTML += '<div class="characterlist" id="list'+j+'"></div>'
            for (var i = 0; i < cList.length; i++) {
                if (cList[i].category == j) {
                    if (year >= cList[i].lived[0] && year <= cList[i].lived[1]) {
                        document.querySelector('#list'+j).innerHTML += '<a href="./?page='+i+'"><div class="characteritem" onmouseover="hoverCharacter('+i+')"><div><img src="'+cList[i].avatar+'" class="cavatar"></div><div class="cname">'+cList[i].name+'</div><div class="csummary">'+cList[i].summary+'</div></div></a>'
                    }
                }
            }
        }
        if (isLogin) {
            document.querySelector('#list'+(cCategory.length - 1)).innerHTML += '<a href="./?page='+cList.length+'"><div class="characteritem"><div class="new"><i class="bx bx-add-to-queue"></i></div><div class="cname">'+LANG.ADDCHARACTER+'</div></div></a>'
        }
    } else {
        for (var i = 0; i < cList.length; i++) {
            if (cList[i].category == category) {
                if (year >= cList[i].lived[0] && year <= cList[i].lived[1]) {
                    document.querySelector('.characterlist').innerHTML += '<a href="./?page='+i+'"><div class="characteritem" onmouseover="hoverCharacter('+i+')"><div><img src="'+cList[i].avatar+'" class="cavatar"></div><div class="cname">'+cList[i].name+'</div><div class="csummary">'+cList[i].summary+'</div></div></a>'
                }
            }
        }
    }

    document.querySelector("#yearChange").addEventListener("click", (e) => {
        var yearValue = document.querySelector("#yearTextInput").value.replace(/\/g, '')
        if (yearValue > json.info.yearRange[1]) {
            yearValue = json.info.yearRange[1]
        } else if (yearValue < json.info.yearRange[0]) {
            yearValue = json.info.yearRange[0]
        }
        location.href = './?year='+yearValue
    })
}

var temporaryRelatedToCharacterCount = []

function addRelatedTo(num) {
    document.querySelector('#relatedTo'+num).innerHTML += '<div class="multiLineInput relatedTo'+num+'" id="cRelatedToEditor'+num+'-'+temporaryRelatedToCharacterCount[num]+'"><label id="cRelatedToLabel'+num+'-'+temporaryRelatedToCharacterCount[num]+'" for="cRelatedTo'+num+'-'+temporaryRelatedToCharacterCount[num]+'">'+(temporaryRelatedToCharacterCount[num]+1)+' :</label> <select name="cRelatedTo'+num+'-'+temporaryRelatedToCharacterCount[num]+'" id="cRelatedTo'+num+'-'+temporaryRelatedToCharacterCount[num]+'"></select></div>'
    for (var j=0; j<json.character.list.length; j++) {
        document.querySelector('#cRelatedTo'+num+'-'+temporaryRelatedToCharacterCount[num]).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
    }
    temporaryRelatedToCharacterCount[num] += 1
}
function deleteRelatedTo(num) {
    if (temporaryRelatedToCharacterCount[num] > 0) {
        temporaryRelatedToCharacterCount[num] -= 1
        document.querySelector('#cRelatedToEditor'+num+'-'+temporaryRelatedToCharacterCount[num]).remove()
    }
}


async function parseYourJSON(json) {
    if (!year) {
        year = json.info.defaultYear
    }
    document.querySelector("#title").innerHTML = '<a href="./">'+json.info.title+'</a>'
    document.querySelector("#subtitle").innerHTML = json.info.subTitle
    if (!page && !note) {
        loadBackground(json)
        if (mode == 'edit' && isLogin) {
            document.querySelector('#wrapper').addEventListener("click", (e) => {
                location.href = './'
            })
            var isSaved = false
            window.onbeforeunload = function(){
                if (!isSaved) {
                    return ' '
                }
            }
            document.querySelector('#popup-content').style.display = 'block'
            document.querySelector('#popup-content').innerHTML = '<div class="editwrapper"></div>'
            document.querySelector('.editwrapper').innerHTML = '<h1>'+LANG.JSONEDITOR+'</h1>'
            document.querySelector('.editwrapper').innerHTML += '<form><label for="editrawjson">Raw JSON Data:</label><textarea id="editrawjson" name="editrawjson">'+JSON.stringify(json, null, 4)+'</textarea><div class="bold" id="editconfirm">'+LANG.CONFIRM+'</div></form>'

            document.querySelector('#editconfirm').addEventListener("click", (e) => {
                json = JSON.parse(document.querySelector('#editrawjson').value.replace(/\/g, ''))
                localStorage.setItem('json', JSON.stringify(json))
                var updatePageUrl = 'https://'+MISSKEYHOST+'/api/pages/update'
                var updatePageParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        i: token,
                        pageId: jsonPageId,
                        title: 'CabinetKey.json',
                        name: 'CabinetKey.json',
                        summary: 'CabinetKey.json',
                        variables: [],
                        script: '',
                        content: [{
                            text: '```\n'+JSON.stringify(json)+'\n```',
                            type: 'text'
                        }]
                    })
                }
                fetch(updatePageUrl, updatePageParam)
                .then(() => {
                    isSaved = true
                    location.href = './'
                })
            })
        }
    } else if (page == 'about'){
        loadBackground(json)
        document.querySelector('#wrapper').addEventListener("click", (e) => {
            location.href = './'
        })
        document.querySelector('#popup-content').style.display = 'block'
        document.querySelector('#popup-content').innerHTML = '<div class="ckeyinfo"></div>'
        document.querySelector('.ckeyinfo').innerHTML = '<h1>'+LANG.ABOUTCABINETKEY+'</h1>'
        document.querySelector('.ckeyinfo').innerHTML += '<div id="readme"><div>'

        var readmeUrl = "https://raw.githubusercontent.com/jyhyun1008/CabinetKey/main/README.md"
        fetch(readmeUrl)
        .then(res => res.text())
        .then((out) => {
            document.querySelector('#readme').innerHTML = parseMd(out)
        })

    } else if (page == 'info') {
        loadBackground(json)
        document.querySelector('#wrapper').addEventListener("click", (e) => {
            location.href = './'
        })
        document.querySelector('#popup-content').style.display = 'block'

        if (mode == 'edit' && isLogin) {
            
            var isSaved = false
            window.onbeforeunload = function(){
                if (!isSaved) {
                    return ' '
                }
            }

            //제목, 틀 생성
            document.querySelector('#popup-content').innerHTML = '<div class="edit"><form class="editform" method="get"><div class="editordiv"><h1>'+LANG.EDITINFO+'</h1></div></form></div>'

            //세계관 제목
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cTitle"><span class="bold">'+LANG.TITLE+'</span></label> <input type="text" id="cTitle" name="cTitle" value="'+json.info.title+'"></div>'
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cSubTitle"><span class="bold">'+LANG.SUBTITLE+'</span></label> <input type="text" id="cSubTitle" name="cSubTitle" value="'+json.info.subTitle+'"></div>'

            //세계관 해시태그
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cMainHashtag"><span class="bold">'+LANG.MAINHASHTAG+'</span></label> <input type="text" id="cMainHashtag" name="cMainHashtag" value="'+json.info.mainHashtag+'"></div><div class="editordiv">'+LANG.cMAINHASHTAG+'</div>'
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cHashtag"><span class="bold">'+LANG.HASHTAGS+'</span></label> <input type="text" id="cHashtag" name="cHashtag" value="'+json.info.hashtags.join(', ')+'"></div><div class="editordiv">'+LANG.cHASHTAGS+'</div>'

            //연도 정보
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cDefaultYear"><span class="bold">'+LANG.DEFAULTYEAR+'</span></label> <input type="text" id="cDefaultYear" name="cDefaultYear" value="'+json.info.defaultYear+'"></div>'

            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cMainYear"><span class="bold">'+LANG.MAINYEAR+'</span></label> <input type="text" id="cMainYear" name="cMainYear" value="'+json.info.mainYear.join(', ')+'"></div><div class="editordiv">'+LANG.cMAINYEAR+'</div>'

            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cYearFrom"><span class="bold">'+LANG.ESTABLISHEDYEAR+'</span></label> <input type="text" id="cYearFrom" name="cYearFrom" value="'+json.info.yearRange[0]+'"></div>'

            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cYearTo"><span class="bold">'+LANG.ABOLISHEDYEAR+'</span></label> <input type="text" id="cYearTo" name="cYearTo" value="'+json.info.yearRange[1]+'"></div>'

            //지도
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><div class="cprofileavatar"><img src="'+json.info.map+'"></div><label for="cAvatar"><span class="bold">'+LANG.MAP+'</span></label> <input type="text" id="cAvatar" name="cAvatar" value="'+json.info.map+'"></div>'

            //요약
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.SUMMARY+'</h1><textarea class="summary" id="cSummary" name="cSummary">'+json.info.summary+'</textarea>'

            //상세 정보
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.DESCRIPTION+'</h1><textarea id="cDescription" name="cDescription">'+json.info.description+'</textarea>'

            //확인 버튼
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold" id="confirm">'+LANG.CONFIRM+'</span> <span class="bold" id="cancel">취소</span>'

            //이벤트 리스너들
            document.querySelector('#cAvatar').addEventListener("input", (e) => {
                document.querySelector('.cprofileavatar').innerHTML = '<img src="'+document.querySelector('#cAvatar').value.replace(/\/g, '')+'">'
            })

            //확인 버튼 이벤트리스너
            document.querySelector('#confirm').addEventListener("click", (e) => {

                //변수에 저장
                var cTitle = document.querySelector('#cTitle').value.replace(/\/g, '')
                var cSubTitle = document.querySelector('#cSubTitle').value.replace(/\/g, '')
                var cMainHashtag = document.querySelector('#cMainHashtag').value.replace(/\/g, '')
                var cHashtag = document.querySelector('#cHashtag').value.replace(/\/g, '').replace(/\s/g, '').split(',')
                var cDefaultYear = parseInt(document.querySelector('#cDefaultYear').value.replace(/\/g, ''))
                var cMainYearArray = document.querySelector('#cMainYear').value.replace(/\/g, '').replace(/\s/g, '').split(',')
                var cMainYear = cMainYearArray.map(function (x) { 
                    return parseInt(x, cDefaultYear); 
                })
                var cYearRange = [parseInt(document.querySelector('#cYearFrom').value.replace(/\/g, '')), parseInt(document.querySelector('#cYearTo').value.replace(/\/g, ''))]
                var cAvatar = document.querySelector('#cAvatar').value.replace(/\/g, '')
                var cSummary = document.querySelector('#cSummary').value.replace(/\/g, '')
                var cDescription = document.querySelector('#cDescription').value.replace(/\/g, '')
                
                var updatedJsonInfo = {
                    "title": cTitle,
                    "subTitle": cSubTitle,
                    "mainHashtag": cMainHashtag,
                    "hashtags": cHashtag,
                    "defaultYear": cDefaultYear,
                    "mainYear": cMainYear,
                    "yearRange": cYearRange,
                    "map": cAvatar,
                    "summary": cSummary,
                    "description": cDescription,
                }

                json.info = updatedJsonInfo
                localStorage.setItem('json', JSON.stringify(json))
                var updatePageUrl = 'https://'+MISSKEYHOST+'/api/pages/update'
                var updatePageParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        i: token,
                        pageId: jsonPageId,
                        title: 'CabinetKey.json',
                        name: 'CabinetKey.json',
                        summary: 'CabinetKey.json',
                        variables: [],
                        script: '',
                        content: [{
                            text: '```\n'+JSON.stringify(json)+'\n```',
                            type: 'text'
                        }]
                    })
                }
                fetch(updatePageUrl, updatePageParam)
                .then(() => {
                    isSaved = true
                    location.href = './'
                })
            })

            document.querySelector('#cancel').addEventListener("click", (e) => {
                location.href = './?page='+page
            })

        } else {
            document.querySelector('#popup-content').innerHTML = '<div class="worldinfo"></div>'

            document.querySelector('.worldinfo').innerHTML = '<h1 class="winfotitle">'+json.info.title+'</h1>'
            document.querySelector('.worldinfo').innerHTML += '<div class="winfosubtitle">'+json.info.subTitle+'<div>'
            document.querySelector('.worldinfo').innerHTML += '<h1>'+LANG.SUMMARY+'</h1>'
            document.querySelector('.worldinfo').innerHTML += '<div class="winfosummary">'+json.info.summary+'<div>'
            document.querySelector('.worldinfo').innerHTML += '<h1>'+LANG.DESCRIPTION+'</h1>'
            document.querySelector('.worldinfo').innerHTML += '<div class="winfodescription">'+json.info.description+'<div>'
        }

    } else if (page == 'collection') {
        loadBackground(json)
        document.querySelector('#wrapper').addEventListener("click", (e) => {
            location.href = './'
        })
        document.querySelector('#popup-content').style.display = 'block'

        if (mode == 'edit' && isLogin) {

            document.querySelector('#popup-content').innerHTML = '<div class="editform"></div>'
            document.querySelector('.editform').innerHTML = '<h1>'+LANG.NEWWORK+'</h1>'

            //제목
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cTitle"><span class="bold">'+LANG.TITLE+'</span></label> <input type="text" id="cTitle" name="cTitle""></div>'

            //완성작 및 초안 선택
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.WORKTYPE+'</span> <select name="cType" id="cType"><option value=" #'+LANG.FINISHEDWORK+'">'+LANG.FINISHEDWORK+'</option><option value=" #'+LANG.DRAFT+'">'+LANG.DRAFT+'</option></select></div>'

            //연관 캐릭터 (틀 생성)
            var temporaryRelatedToCount = 0
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.RELATEDTO+'</span> <span id="addRelatedTo">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo">'+LANG.DELLINE+'</span></div><div id="relatedTo" class="editordiv"></div>'

            //공개 범위 (홈, 홈로컬, 비공개)
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.VISIBILITY+'</span> <select name="cVisibility" id="cVisibility"><option value="home">'+LANG.vHOME+'</option><option value="local">'+LANG.vHOMELOCAL+'</option><option value="specified">'+LANG.vSPECIFIED+'</option></select></div>'

            //내용
            document.querySelector('.editform').innerHTML += '<textarea id="cContent" name="cContent"></textarea>'

            //파일첨부
            document.querySelector('.editform').innerHTML += '<div class="editordiv" id="imgUploader"><div id="imgUploadFrame0" onclick="deleteFile(this);"><span class="bold">'+LANG.ADDFILE+'</span> <span id="imgUpload">'+LANG.CLICK+'</span></div></div><input type="file" id="imgRealUpload" accept="image/*" style="display: none;">'

            //확인 버튼
            document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold" id="confirm">'+LANG.CONFIRM+'</span> <span class="bold" id="cancel">취소</span>'

            //연관 캐릭터 이벤트 리스너
            document.querySelector('#addRelatedTo').addEventListener("click", (e) => {
                document.querySelector('#relatedTo').innerHTML += '<div class="multiLineInput" id="cRelatedToEditor'+temporaryRelatedToCount+'"><label id="cRelatedToLabel'+temporaryRelatedToCount+'" for="cRelatedTo'+temporaryRelatedToCount+'">'+(temporaryRelatedToCount+1)+' :</label> <select name="cRelatedTo'+temporaryRelatedToCount+'" id="cRelatedTo'+temporaryRelatedToCount+'" class="relatedTo" ></select></div>'
                for (var j=0; j<json.character.list.length; j++) {
                    document.querySelector('#cRelatedTo'+temporaryRelatedToCount).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                }
                temporaryRelatedToCount += 1
            })
            document.querySelector('#deleteRelatedTo').addEventListener("click", (e) => {
                if (temporaryRelatedToCount > 0) {
                    temporaryRelatedToCount -= 1
                    document.querySelector('#cRelatedToEditor'+temporaryRelatedToCount).remove()
                }
            })

            //이미지 업로드버튼
            var imgUpload = document.querySelector('#imgUpload')
            var imgRealUpload = document.querySelector('#imgRealUpload')
            imgUpload.addEventListener('click', () => imgRealUpload.click())
            imgRealUpload.addEventListener('change', function(e) {
                var reader = new FileReader();
                reader.onloadend = function() {
                    var blob = window.dataURLtoBlob(reader.result)
                    const formData = new FormData()
                    formData.append('file', blob, {
                        filename: 'untitled.png',
                        contentType: 'image/png',
                    });
                    formData.append("i", token)
                    
                    var imgUploadURL = 'https://'+MISSKEYHOST+'/api/drive/files/create'
                    var imgUploadParam = {
                        method: 'POST',
                        headers: {
                        },
                        body: formData
                    }
                    fetch(imgUploadURL, imgUploadParam)
                    .then((imgData) => {return imgData.json()})
                    .then((imgRes) => {
                        document.querySelector('#imgUpload').innerText = imgRes.id
                        document.querySelector('#imgUpload').classList.add('imgUploaded')
                        document.querySelector('#imgUpload').id = 'imgUploaded'+fileCount.l
                        fileCount.l += 1

                        document.querySelector('#imgUploader').innerHTML += '<div id="imgUploadFrame'+fileCount.l+'" onclick="deleteFile(this);" ><span class="bold">'+LANG.ADDFILE+'</span> <span id="imgUpload">'+LANG.CLICK+'</span></div>'

                        document.querySelector('#imgUpload').addEventListener('click', () => imgRealUpload.click())
                    })
                    .catch(err => {throw err});
                    
                }
                reader.readAsDataURL(this.files[0])
            })

            //확인버튼 이벤트리스너
            document.querySelector('#confirm').addEventListener("click", (e) => {

                var cTitle = document.querySelector('#cTitle').value.replace(/\/g, '')
                var cType = document.querySelector('#cType').value.replace(/\/g, '')
                var cRelatedTo = []
                for (var j=0; j < document.querySelectorAll('.relatedTo').length; j++) {
                    var cIndex = parseInt(document.querySelector('#cRelatedTo'+j).value.replace(/\/g, ''))
                    cRelatedTo[j] = json.character.list[cIndex].hashtag
                }
                var cRelatedText = cRelatedTo.join(' #')
                var cVisibility = document.querySelector('#cVisibility').value.replace(/\/g, '')
                if (cVisibility == 'home' || cVisibility == 'specified') {
                    cLocalOnly = false
                } else {
                    cLocalOnly = true
                    cVisibility = 'home'
                }
                var cContent = document.querySelector('#cContent').value.replace(/\/g, '')
                var cFile = []
                for (var i=0; i < Math.min(document.querySelectorAll('.imgUploaded').length, 16); i++) {
                    cFile.push(document.querySelector('#imgUploaded'+i).innerText)
                }
                
                var createNoteUrl = 'https://'+MISSKEYHOST+'/api/notes/create'
                var createNoteParam
                if (cFile.length > 0) {
                    createNoteParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            cw: cTitle,
                            text: cContent+'\n\n#'+cRelatedText+' #'+json.info.mainHashtag+cType+' @cabinetkey@a.gup.pe',
                            visibility: cVisibility,
                            localOnly: cLocalOnly,
                            fileIds: cFile
                        })
                    }
                } else {
                    createNoteParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            cw: cTitle,
                            text: cContent+'\n\n#'+cRelatedText+' #'+json.info.mainHashtag+cType+' @cabinetkey@a.gup.pe',
                            visibility: cVisibility,
                            localOnly: cLocalOnly,
                        })
                    }
                }
                fetch(createNoteUrl, createNoteParam)
                .then((noteData) => { return noteData.json() })
                .then((noteRes) => {
                    isSaved = true
                    location.href = './?note='+noteRes.createdNote.id
                })
            })
        } else {

            document.querySelector('#popup-content').innerHTML = '<div class="collection"></div>'
        
            document.querySelector('.collection').innerHTML += '<h1 class="collectiontitle">작품모음</h1>'
            document.querySelector('.collection').innerHTML += '<div class="collectionlist"></div>'
            document.querySelector('.collection').innerHTML += '<div class="collectionqid"></div>'
    
            var findArtsUrl = 'https://'+MISSKEYHOST+'/api/notes/search'
            var findArtsParam
            if (!qid || qid == 0 ) {
                if (isLogin) {
                    findArtsParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            query: json.info.mainHashtag+' #'+LANG.FINISHEDWORK,
                            userId: MISSKEYID,
                            limit: 100
                        })
                    }
                } else {
                    findArtsParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: json.info.mainHashtag+' #'+LANG.FINISHEDWORK,
                            userId: MISSKEYID,
                            limit: 100
                        })
                    }
                }
                document.querySelector('.collectionqid').innerHTML = '0 · <a href="./?page='+page+'&qid='+1+'">'+LANG.NEXT+'</a>'
            } else {
                if (isLogin) {
                    findArtsParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            query: json.info.mainHashtag+' #'+LANG.FINISHEDWORK,
                            userId: MISSKEYID,
                            limit: 100,
                            untilId: fetchAgain(qid, json.info.mainHashtag+' #'+LANG.FINISHEDWORK, MISSKEYID)
                        })
                    }
                } else {
                    findArtsParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            query: json.info.mainHashtag+' #'+LANG.FINISHEDWORK,
                            userId: MISSKEYID,
                            limit: 100,
                            untilId: fetchAgain(qid, json.info.mainHashtag+' #'+LANG.FINISHEDWORK, MISSKEYID)
                        })
                    }
                }
                document.querySelector('.collectionqid').innerHTML = '<a href="./?page='+page+'&qid='+(qid-1)+'">'+LANG.PREV+'</a> · '+qid+' · <a href="./?page='+page+'&qid='+(qid+1)+'">'+LANG.NEXT+'</a>'
            }
            fetch(findArtsUrl, findArtsParam)
            .then((notesData) => {return notesData.json()})
            .then((notesRes) => {
                for (var i = 0; i<notesRes.length; i++){
    
                    if (notesRes[i].files.length == 0) {
                        document.querySelector('.collectionlist').innerHTML += '<div class="collectionel"><a href="./?note='+notesRes[i].id+'"><div class="overflowhidden" id="collection'+i+'"></div></a></div>'
                        if (notesRes[i].cw) document.querySelector('#collection'+i).innerHTML = '</h1>'+notesRes[i].cw+'</h1>'
                        document.querySelector('#collection'+i).innerHTML += parseMd(notesRes[i].text)
                    } else {
                        document.querySelector('.collectionlist').innerHTML += '<div class="collectionel"><a href="./?note='+notesRes[i].id+'"><img src="'+notesRes[i].files[0].url+'"></a></div>'
                    }
                }
    
                if (isLogin) {
                    document.querySelector('.collectionlist').innerHTML += '<div class="collectionel"><div class="new"><a href="./?page=collection&mode=edit"><i class="bx bx-add-to-queue"></i></a></div></div>'
                }
            })
        }

    } else if (page && page != 'callback') {
        loadBackground(json)
        document.querySelector('#wrapper').addEventListener("click", (e) => {
            location.href = './'
        })
        document.querySelector('#popup-content').style.display = 'block'
        var cList = json.character.list

        if (page.includes('song')) {
            var songNo = parseInt(page.split('song')[1])
            var songInfo = json.themeSong[songNo]
            if (!songInfo && isLogin) {
                if (!mode) {
                    location.href = location.href + '&mode=edit'
                } else {
                    songInfo = {
                        "embed": "",
                        "title": "",
                        "artist": "",
                        "relatedTo": [],
                        "summary": "",
                        "description": "",
                        "lyrics": ""
                      }
                }
            }

            if (mode == 'edit' && isLogin) {
                
                var isSaved = false
                window.onbeforeunload = function(){
                    if (!isSaved) {
                        return ' '
                    }
                }

                //제목, 틀 생성
                document.querySelector('#popup-content').innerHTML = '<div class="edit"><form class="editform" method="get"><div class="editordiv"><h1>'+LANG.THEMESONGEDIT.before+songNo+LANG.THEMESONGEDIT.after+'</h1></div></form></div>'

                //이름
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cTitle"><span class="bold">'+LANG.NAME+'</span></label> <input type="text" id="cTitle" name="cTitle" value="'+songInfo.title+'"></div>'

                //임베딩
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><div class="cEmbedclass">'+songInfo.embed+'</div><div class="editordiv"><label for="cEmbed"><span class="bold">'+LANG.EMBEDCODE+'</span></label> <input type="text" id="cEmbed" name="cEmbed" value="'+songInfo.embed+'"></div>'

                //아티스트
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cArtist"><span class="bold">'+LANG.ARTIST+'</span></label> <input type="text" id="cArtist" name="cArtist" value="'+songInfo.artist+'"></div>'

                //요약
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.SUMMARY+'</h1><textarea class="summary" id="cSummary" name="cSummary">'+songInfo.summary+'</textarea>'

                //상세 정보
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.DESCRIPTION+'</h1><textarea id="cDescription" name="cDescription">'+songInfo.description+'</textarea>'

                //가사
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.LYRICS+'</h1><textarea id="cLyrics" name="cLyrics">'+songInfo.lyrics+'</textarea>'

                //연관 캐릭터 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.RELATEDTO+'</h1><span id="addRelatedTo">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo">'+LANG.DELLINE+'</span></div><div id="relatedTo" class="editordiv"></div>'

                //연관 캐릭터 (드롭다운)
                var temporaryRelatedToCount = songInfo.relatedTo.length
                for (var i=0; i<songInfo.relatedTo.length; i++) {
                    document.querySelector('#relatedTo').innerHTML += '<div class="multiLineInput relatedTo" id="cRelatedToEditor'+i+'"><label id="cRelatedToLabel'+i+'" for="cRelatedTo'+i+'">'+(i+1)+' :</label> <select name="cRelatedTo'+i+'" id="cRelatedTo'+i+'"></select></div>'
                    for (var j=0; j<json.character.list.length; j++) {
                        if (songInfo.relatedTo[i] == j) {
                            document.querySelector('#cRelatedTo'+i).innerHTML += '<option value="'+j+'" selected>'+json.character.list[j].name+'</option>'
                        } else {
                            document.querySelector('#cRelatedTo'+i).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                        }
                    }
                }

                //확인 버튼
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold" id="confirm">'+LANG.CONFIRM+'</span> <span class="bold" id="cancel">취소</span>'

                //이벤트 리스너들
                document.querySelector('#cEmbed').addEventListener("input", (e) => {
                    document.querySelector('.cEmbedclass').innerHTML = document.querySelector('#cEmbed').value.replace(/\/g, '')
                })

                //연관 캐릭터 이벤트 리스너
                document.querySelector('#addRelatedTo').addEventListener("click", (e) => {
                    document.querySelector('#relatedTo').innerHTML += '<div class="multiLineInput" id="cRelatedToEditor'+temporaryRelatedToCount+'"><label id="cRelatedToLabel'+temporaryRelatedToCount+'" for="cRelatedTo'+temporaryRelatedToCount+'">'+(temporaryRelatedToCount+1)+' :</label> <select name="cRelatedTo'+temporaryRelatedToCount+'" id="cRelatedTo'+temporaryRelatedToCount+'"></select></div>'
                    for (var j=0; j<json.character.list.length; j++) {
                        document.querySelector('#cRelatedTo'+temporaryRelatedToCount).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                    }
                    temporaryRelatedToCount += 1
                })
                document.querySelector('#deleteRelatedTo').addEventListener("click", (e) => {
                    if (temporaryRelatedToCount > 0) {
                        temporaryRelatedToCount -= 1
                        document.querySelector('#cRelatedToEditor'+temporaryRelatedToCount).remove()
                    }
                })

                //확인 버튼 이벤트리스너
                document.querySelector('#confirm').addEventListener("click", (e) => {

                    var cTitle = document.querySelector('#cTitle').value.replace(/\/g, '')
                    var cArtist = document.querySelector('#cArtist').value.replace(/\/g, '').replace(/\"/g, "'")
                    var cEmbed = document.querySelector('#cEmbed').value.replace(/\/g, '').replace(/\"/g, "'")
                    var cRelatedTo = []
                    for (var j=0; j < document.querySelectorAll('#relatedTo').length; j++) {
                        cRelatedTo[j] = document.querySelector('#cRelatedTo'+j).value.replace(/\/g, '')
                    }
                    var cSummary = document.querySelector('#cSummary').value.replace(/\/g, '')
                    var cDescription = document.querySelector('#cDescription').value.replace(/\/g, '')
                    var cLyrics = document.querySelector('#cLyrics').value.replace(/\/g, '')
                    
                    var updatedJsonSongInfo = {
                        "title": cTitle,
                        "artist": cArtist,
                        "embed": cEmbed,
                        "relatedTo": cRelatedTo,
                        "summary": cSummary,
                        "description": cDescription,
                        "lyrics": cLyrics
                    }
                    json.themeSong[songNo] = updatedJsonSongInfo

                    localStorage.setItem('json', JSON.stringify(json))
                    var updatePageUrl = 'https://'+MISSKEYHOST+'/api/pages/update'
                    var updatePageParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            pageId: jsonPageId,
                            title: 'CabinetKey.json',
                            name: 'CabinetKey.json',
                            summary: 'CabinetKey.json',
                            variables: [],
                            script: '',
                            content: [{
                                text: '```\n'+JSON.stringify(json)+'\n```',
                                type: 'text'
                            }]
                        })
                    }
                    fetch(updatePageUrl, updatePageParam)
                    .then(() => {
                        isSaved = true
                        location.href = './?page='+page
                    })
                })

                document.querySelector('#cancel').addEventListener("click", (e) => {
                    location.href = './?page='+page
                })

            } else {

                document.querySelector('#popup-content').innerHTML = '<div class="songinfo"></div>'
                document.querySelector('#popup-content').innerHTML += '<div class="relatedcharacterlist"></div>'
                
                document.querySelector('.songinfo').innerHTML = '<h1>'+songInfo.title+'</h1>'
                document.querySelector('.songinfo').innerHTML += '<div>'+songInfo.artist+'<div>'
                document.querySelector('.songinfo').innerHTML += '<div>'+songInfo.embed+'<div>'
    
                document.querySelector('.songinfo').innerHTML += '<h1>'+LANG.SUMMARY+'</h1>'
                document.querySelector('.songinfo').innerHTML += '<div >'+songInfo.summary+'<div>'
                document.querySelector('.songinfo').innerHTML += '<h1>'+LANG.DESCRIPTION+'</h1>'
                document.querySelector('.songinfo').innerHTML += '<div>'+parseMd(songInfo.description)+'<div>'
                document.querySelector('.songinfo').innerHTML += '<h1>'+LANG.LYRICS+'</h1>'
                document.querySelector('.songinfo').innerHTML += '<div>'+parseMd(songInfo.lyrics)+'<div>'
                
                document.querySelector('.songinfo').innerHTML += '<h1>연관 캐릭터</h1>'
    
                var relatedCategorylist = songInfo.relatedTo
                for (var j = 0; j < relatedCategorylist.length; j++) {
                    document.querySelector('.relatedcharacterlist').innerHTML += '<a href="./?page='+relatedCategorylist[j]+'"><div class="characteritem" onmouseover="hoverCharacter('+relatedCategorylist[j]+')"><div><img src="'+cList[relatedCategorylist[j]].avatar+'" class="cavatar"></div><div class="cname">'+cList[relatedCategorylist[j]].name+'</div><div class="csummary">'+cList[relatedCategorylist[j]].summary+'</div></div></a>'
                }
            }
        } else if (page.includes(',')) {

            if (!year) year = json.info.defaultYear
            var worldPage = nowHere(page, year)

            if (!worldPage && isLogin) {
                if (!mode) {
                    location.href = location.href + '&mode=edit'
                } else {
                    worldPage = {
                        "data": {
                            "name": "",
                            "image": "",
                            "summary": "",
                            "description": "",
                            "secret": "",
                            "eventChronology": {},
                            "relatedTo": {}
                        },
                        "key": year+","+year
                    }
                }
            }

            if (mode == 'edit' && isLogin) {
                
                var isSaved = false
                window.onbeforeunload = function(){
                    if (!isSaved) {
                        return ' '
                    }
                }

                //제목, 틀 생성
                document.querySelector('#popup-content').innerHTML = '<div class="edit"><form class="editform" method="get"><div class="editordiv"><h1>'+LANG.LOCATIONEDIT.before+page+LANG.LOCATIONEDIT.after+'</h1></div></form></div>'

                //이름
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cName"><span class="bold">'+LANG.NAME+'</span></label> <input type="text" id="cName" name="cName" value="'+worldPage.name+'"></div>'

                //이미지
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><div class="cprofileavatar"><img src="'+worldPage.data.image+'"></div><div class="editordiv"><label for="cAvatar"><span class="bold">이미지</span></label> <input type="text" id="cAvatar" name="cAvatar" value="'+worldPage.data.image+'"></div>'

                //유효 연도 1
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cYearFrom"><span class="bold">'+LANG.ESTABLISHEDYEAR+'</span></label> <input type="text" id="cYearFrom" name="cYearFrom" value="'+worldPage.key.split(',')[0]+'"></div>'

                //유효 연도 2
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cYearTo"><span class="bold">'+LANG.ABOLISHEDYEAR+'</span></label> <input type="text" id="cYearTo" name="cYearTo" value="'+worldPage.key.split(',')[0]+'"></div>'

                //사건 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.EVENT+'</span> <span id="addEvent">'+LANG.ADDLINE+'</span> · <span id="deleteEvent">'+LANG.DELLINE+'</span></div><ul><li>'+LANG.cCHRONOLOGY+'</li></ul><div id="event" class="editordiv"></div>'

                //사건 (input 지옥)
                var event = Object.keys(worldPage.data.eventChronology)
                var temporaryEventCount = event.length
                var temporaryEventKeyArray = event
                var temporaryEventValueArray = []
                for (var i=0; i<event.length; i++) {
                    temporaryEventValueArray[i] = worldPage.data.eventChronology[temporaryEventKeyArray[i]]
                    document.querySelector('#event').innerHTML += '<div class="multiLineEventInput" id="cEventEditor'+i+'"><input class="key event" id="cEventLabel'+i+'" name="cEventLabel'+i+'" value="'+temporaryEventKeyArray[i]+'"> <input type="text" id="cEvent'+i+'" name="cEvent'+i+'" value="'+temporaryEventValueArray[i]+'"></div>'
                }

                //요약
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.SUMMARY+'</h1><textarea class="summary" id="cSummary" name="cSummary">'+worldPage.data.summary+'</textarea>'

                //상세 정보
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.DESCRIPTION+'</h1><textarea id="cDescription" name="cDescription">'+worldPage.data.description+'</textarea>'

                //비밀 설정
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.SECRET+'</h1><textarea id="cSecret" name="cSecret">'+worldPage.data.secret+'</textarea>'

                //관계 (1차 틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.RELATEDTO+'</h1><div><span id="addRelatedTo">'+LANG.ADDCATEGORY+'</span> · <span id="deleteRelatedTo">'+LANG.DELCATEGORY+'</span></div><br><div id="cRelatedTo"></div>'

                //관계 (2차 틀 생성 및 드롭다운)
                var relatedToKey = Object.keys(worldPage.data.relatedTo)
                var temporaryRelatedToCount = relatedToKey.length
                for (var i=0; i<temporaryRelatedToCount; i++) {
                    document.querySelector('#cRelatedTo').innerHTML += '<div class="editordiv" id="cRelatedToEditor'+i+'"><input class="key relatedTo" id="cRelatedToKey'+i+'" value="'+relatedToKey[i]+'"> <span id="addRelatedTo'+i+'" onclick="addRelatedTo('+i+')">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo'+i+'" onclick="deleteRelatedTo('+i+')">'+LANG.DELLINE+'</span><div id="relatedTo'+i+'" class="editordiv"></div></div>'

                    temporaryRelatedToCharacterCount.push(worldPage.data.relatedTo[relatedToKey[i]].length)
                    for (var l=0; l<worldPage.data.relatedTo[relatedToKey[i]].length; l++) {
                        document.querySelector('#relatedTo'+i).innerHTML += '<div class="multiLineRelatedToInput" id="cRelatedToEditor'+i+'-'+l+'"><label id="cRelatedToLabel'+i+'-'+l+'" for="cRelatedTo'+i+'-'+l+'">'+(l+1)+' :</label> <select name="cRelatedTo'+i+'-'+l+'" id="cRelatedTo'+i+'-'+l+'"></select></div>'
                        for (var j=0; j<json.character.list.length; j++) {
                            if (worldPage.data.relatedTo[relatedToKey[l]] == j) {
                                document.querySelector('#cRelatedTo'+i+'-'+l).innerHTML += '<option value="'+j+'" selected>'+json.character.list[j].name+'</option>'
                            } else {
                                document.querySelector('#cRelatedTo'+i+'-'+l).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                            }
                        }
                    }
                }

                //확인 버튼
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold" id="confirm">'+LANG.CONFIRM+'</span> <span class="bold" id="cancel">취소</span>'

                //이벤트 리스너들
                document.querySelector('#cAvatar').addEventListener("input", (e) => {
                    document.querySelector('.cprofileavatar').innerHTML = '<img src="'+document.querySelector('#cAvatar').value.replace(/\/g, '')+'">'
                })

                //사건 이벤트리스너
                document.querySelector('#addEvent').addEventListener("click", (e) => {
                    document.querySelector('#event').innerHTML += '<div class="multiLineEventInput" id="cEventEditor'+temporaryEventCount+'"><input class="key event" name="cEventLabel'+temporaryEventCount+'" id="cEventLabel'+temporaryEventCount+'" value="0"> <input name="cEvent'+temporaryEventCount+'" id="cEvent'+temporaryEventCount+'"></div>'
                    temporaryEventCount += 1

                    for (var i=0; i<document.querySelectorAll('.multiLineEventInput').length; i++) {
                        document.querySelector('#cEventLabel'+i).addEventListener("change", (e) => {
                            temporaryEventKeyArray[i] = document.querySelector('#cEventLabel'+i).value
                        })
                        document.querySelector('#cEvent'+i).addEventListener("change", (e) => {
                            temporaryEventValueArray[i] = document.querySelector('#cEvent'+i).value
                        })
                    }
                })
                document.querySelector('#deleteEvent').addEventListener("click", (e) => {
                    if (temporaryEventCount > 0) {
                        temporaryEventCount -= 1
                        document.querySelector('#cEventEditor'+temporaryEventCount).remove()    
                    }

                    for (var i=0; i<document.querySelectorAll('.multiLineEventInput').length; i++) {
                        document.querySelector('#cEventLabel'+i).addEventListener("change", (e) => {
                            temporaryEventKeyArray[i] = document.querySelector('#cEventLabel'+i).value
                        })
                        document.querySelector('#cEvent'+i).addEventListener("change", (e) => {
                            temporaryEventValueArray[i] = document.querySelector('#cEvent'+i).value
                        })
                    }
                })

                //인간관계 이벤트리스너

                //인간관계 (분류) 이벤트리스너
                document.querySelector('#addRelatedTo').addEventListener("click", (e) => {
                    document.querySelector('#cRelatedTo').innerHTML += '<div class="editordiv" id="cRelatedToEditor'+temporaryRelatedToCount+'"><input class="key relatedTo" value="" id="cRelatedToKey'+temporaryRelatedToCount+'"> <span id="addRelatedTo'+temporaryRelatedToCount+'" onclick="addRelatedTo('+temporaryRelatedToCount+')">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo'+temporaryRelatedToCount+'" onclick="deleteRelatedTo('+temporaryRelatedToCount+')">'+LANG.DELLINE+'</span><div id="relatedTo'+temporaryRelatedToCount+'" class="editordiv"></div></div>'
                    temporaryRelatedToCharacterCount.push(0)
                    temporaryRelatedToCount += 1
                })
                document.querySelector('#deleteRelatedTo').addEventListener("click", (e) => {
                    if (temporaryRelatedToCount > 0) {
                        temporaryRelatedToCount -= 1
                        temporaryRelatedToCharacterCount.pop()
                        document.querySelector('#cRelatedToEditor'+temporaryRelatedToCount).remove()
                    }
                })

                //확인 버튼 이벤트리스너
                document.querySelector('#confirm').addEventListener("click", (e) => {

                    var cName = document.querySelector('#cName').value.replace(/\/g, '')
                    var cAvatar = document.querySelector('#cAvatar').value.replace(/\/g, '')
                    var cLived = document.querySelector('#cBirthYear').value.replace(/\/g, '') + ',' + document.querySelector('#cDeathYear').value.replace(/\/g, '')
                    var cEvent = {}
                    for (var i=0; i < document.querySelectorAll('.key.event').length; i++) {
                        var key = document.querySelector('#cEventLabel'+i).value.replace(/\/g, '')
                        cEvent[key] = document.querySelector('#cEvent'+i).value.replace(/\/g, '')
                    }
                    var cRelatedTo = {}
                    for (var i=0; i < document.querySelectorAll('.key.relatedTo').length; i++) {
                        var key = document.querySelector('#cRelatedToKey'+i).value.replace(/\/g, '')
                        cRelatedTo[key] = []
                        for (var j=0; j < document.querySelectorAll('#relatedTo'+i).length; j++) {
                            cRelatedTo[key][j] = document.querySelector('#cRelatedTo'+i+'-'+j).value.replace(/\/g, '')
                        }
                    }
                    var cSummary = document.querySelector('#cSummary').value.replace(/\/g, '')
                    var cDescription = document.querySelector('#cDescription').value.replace(/\/g, '')
                    var cSecret = document.querySelector('#cSecret').value.replace(/\/g, '')
                    
                    var updatedKey = cLived
                    var updatedJsonworldInfo = {
                        "name": cName,
                        "image": cAvatar,
                        "eventChronology": cEvent,
                        "relatedTo": cRelatedTo,
                        "summary": cSummary,
                        "description": cDescription,
                        "secret": cSecret
                    }
                    json.world[updatedKey] = updatedJsonworldInfo

                    //겹치는 키값 삭제
                    for (var i=0; i<Object.keys(json.world[page]).length; i++) {
                        if (updatedKey[1] >= Object.keys(json.world[page])[i].split(',')[0] && updatedKey[0] <= Object.keys(json.world[page])[i].split(',')[1]) {
                            delete json.world[page][Object.keys(json.world[page])[i]]
                        }
                    }

                    localStorage.setItem('json', JSON.stringify(json))
                    var updatePageUrl = 'https://'+MISSKEYHOST+'/api/pages/update'
                    var updatePageParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            pageId: jsonPageId,
                            title: 'CabinetKey.json',
                            name: 'CabinetKey.json',
                            summary: 'CabinetKey.json',
                            variables: [],
                            script: '',
                            content: [{
                                text: '```\n'+JSON.stringify(json)+'\n```',
                                type: 'text'
                            }]
                        })
                    }
                    fetch(updatePageUrl, updatePageParam)
                    .then(() => {
                        isSaved = true
                        location.href = './?page='+page
                    })
                })

                document.querySelector('#cancel').addEventListener("click", (e) => {
                    location.href = './?page='+page
                })

            } else {
                document.querySelector('#popup-content').innerHTML = '<div class="worldlocation"></div>'
                document.querySelector('#popup-content').innerHTML += '<div class="relatedcharacterlist"></div>'
    
                document.querySelector('.worldlocation').innerHTML = '<h1 class="wlocationname">'+worldPage.data.name+'</h1>'
                document.querySelector('.worldlocation').innerHTML += '<div class="wlocationimage"><img src="'+worldPage.data.image+'"><div>'
                document.querySelector('.worldlocation').innerHTML += '<div class="cprofiletable"><div><span class="bold">'+LANG.CRONOLOGY+'</span></div><table class="chronology"><tr><th>'+LANG.YEAR+'</th><th>'+LANG.EVENT+'</th></tr></table><div>'
    
                for (var i=0; i<Object.keys(worldPage.data.eventChronology).length; i++) {
                    var key = Object.keys(worldPage.data.eventChronology)[i]
                    var event1 = worldPage.data.eventChronology[key]
                    document.querySelector('.chronology').innerHTML += '<tr><td>'+key+'</td><td>'+event1+'</td></tr>'
                }
    
                document.querySelector('.worldlocation').innerHTML += '<h1>'+LANG.SUMMARY+'</h1>'
                document.querySelector('.worldlocation').innerHTML += '<div class="cprofilesummary">'+worldPage.data.summary+'<div>'
                document.querySelector('.worldlocation').innerHTML += '<h1>'+LANG.DESCRIPTION+'</h1>'
                document.querySelector('.worldlocation').innerHTML += '<div class="cprofiledescription">'+parseMd(worldPage.data.description)+'<div>'
                var hideandsecret = true
                document.querySelector('.worldlocation').innerHTML += '<h1>'+LANG.SECRET+'</h1>'
                document.querySelector('.worldlocation').innerHTML += '<div><span id="hideSecret">'+LANG.FOLD+'</span>'
                document.querySelector('.worldlocation').innerHTML += '<div class="cprofilesecret">'+parseMd(worldPage.data.secret)+'<div>'
    
                document.querySelector('.worldlocation').innerHTML += '<h1>연관 정보</h1>'
    
                var relatedCategory = Object.keys(worldPage.data.relatedTo)
                for (var i = 0; i < relatedCategory.length; i++) {
                    document.querySelector('.relatedcharacterlist').innerHTML += '<div class="relatedcharactercategory" id="relatedcategory'+i+'">'+relatedCategory[i]+'</div>'
                    document.querySelector('.relatedcharacterlist').innerHTML += '<div class="relatedcharactercategorylist" id="relatedlist'+i+'"></div>'
                    var relatedCategorylist = worldPage.data.relatedTo[relatedCategory[i]]
                    for (var j = 0; j < relatedCategorylist.length; j++) {
                        document.querySelector('#relatedlist'+i).innerHTML += '<a href="./?page='+relatedCategorylist[j]+'"><div class="characteritem" onmouseover="hoverCharacter('+relatedCategorylist[j]+')"><div><img src="'+cList[relatedCategorylist[j]].avatar+'" class="cavatar"></div><div class="cname">'+cList[relatedCategorylist[j]].name+'</div><div class="csummary">'+cList[relatedCategorylist[j]].summary+'</div></div></a>'
                    }
                }

                document.querySelector('#hideSecret').addEventListener("click", (e) => {
                    if (hideandsecret) {
                        document.querySelector('.cprofilesecret').style.display = 'block'
                        hideandsecret = false
                    } else {
                        document.querySelector('.cprofilesecret').style.display = 'none'
                        hideandsecret = true
                    }
                })
            }

        } else {

            if (!cList[page] && isLogin) {
                if (!mode) {
                    location.href = location.href + '&mode=edit'
                } else {
                    cList[page] = {
                        "avatar": "https://peachtart2.s3.ap-northeast-1.amazonaws.com/tart/6f0f78c1-bd3f-4732-9c62-15ae451c2257.png",
                        "name": "",
                        "meaning": "",
                        "nickname": {},
                        "birthday": "",
                        "lived": [0, 0],
                        "category": "0",
                        "subCategory": "",
                        "eventChronology": {},
                        "positionChronology": {},
                        "relatedTo": {},
                        "goal": [],
                        "themeSong": [],
                        "summary": "",
                        "description": "",
                        "secret": "",
                        "hashtag": ""
                      }
                }
            }

            if (mode == 'edit' && isLogin) {

                var isSaved = false
                window.onbeforeunload = function(){
                    if (!isSaved) {
                        return ' '
                    }
                }

                //제목, 틀 생성
                document.querySelector('#popup-content').innerHTML = '<div class="edit"><form class="editform" action="/confirm.html" method="get"><div class="editordiv"><h1>'+LANG.CHARACTEREDIT.before+page+LANG.CHARACTEREDIT.after+'</h1></div></form></div>'

                //이름
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cName"><span class="bold">'+LANG.NAME+'</span></label> <input type="text" id="cName" name="cName" value="'+cList[page].name+'"></div>'

                //해시태그
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cHashtag"><span class="bold">전용 태그</span></label> <input type="text" id="cHashtag" name="cHashtag" value="'+cList[page].hashtag+'"></div>'

                //아바타
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><div class="cprofileavatar"><img src="'+cList[page].avatar+'"></div><label for="cAvatar"><span class="bold">'+LANG.IMAGE+'</span></label> <input type="text" id="cAvatar" name="cAvatar" value="'+cList[page].avatar+'"></div>'

                //테마 송 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">테마 송</span> <span id="addThemeSong">'+LANG.ADDLINE+'</span> · <span id="deleteThemeSong">'+LANG.DELLINE+'</span></div><div id="themeSong" class="editordiv"></div>'

                //테마 송 (드롭다운)
                var temporaryThemeSongCount = cList[page].themeSong.length
                for (var i=0; i<cList[page].themeSong.length; i++) {
                    document.querySelector('#themeSong').innerHTML += '<div class="multiLineInput themeSong" id="cThemesongEditor'+i+'"><label id="cThemesongLabel'+i+'" for="cThemesong'+i+'">'+(i+1)+' :</label> <select name="cThemesong'+i+'" id="cThemesong'+i+'"></select></div>'
                    for (var j=0; j<json.themeSong.length; j++) {
                        if (cList[page].themeSong[i] == j) {
                            document.querySelector('#cThemesong'+i).innerHTML += '<option value="'+j+'" selected>'+json.themeSong[j].title+'</option>'
                        } else {
                            document.querySelector('#cThemesong'+i).innerHTML += '<option value="'+j+'">'+json.themeSong[j].title+'</option>'
                        }
                    }
                }

                //이름의 유래
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cMeaning"><span class="bold">'+LANG.MEANING+'</span></label> <input type="text" id="cMeaning" name="cMeaning" value="'+cList[page].meaning+'"></div>'

                //다른 이름들 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">다른 이름들</span> <span id="addNickname">'+LANG.ADDLINE+'</span> · <span id="deleteNickname">'+LANG.DELLINE+'</span></div><div id="nicknames" class="editordiv"></div>'

                //다른 이름들 (input 지옥)
                var nicknames = Object.keys(cList[page].nickname)
                var temporaryNicknameCount = nicknames.length
                for (var i=0; i<nicknames.length; i++) {
                    document.querySelector('#nicknames').innerHTML += '<div class="multiLineInput" id="cNicknamesEditor'+i+'"><input class="key nicknames" id="cNicknamesLabel'+i+'" name="cNicknamesLabel'+i+'" value="'+nicknames[i]+'"> <input type="text" class="val nicknames" id="cNicknames'+i+'" name="cNicknames'+i+'" value="'+cList[page].nickname[nicknames[i]]+'"></div>'
                }

                //분류
                document.querySelector('.editform').innerHTML += '<div class="editordiv" id="cCategoryEditor"><label id="cCategoryLabel" for="cCategory"><span class="bold"> '+LANG.CATEGORY+'</span> </label> <select name="cCategory" id="cCategory"></select></div>'
                for (var j=0; j<json.character.category.length; j++) {
                    if (cList[page].category == j) {
                        document.querySelector('#cCategory').innerHTML += '<option value="'+j+'" selected>'+json.character.category[j]+'</option>'
                    } else {
                        document.querySelector('#cCategory').innerHTML += '<option value="'+j+'">'+json.character.category[j]+'</option>'
                    }
                }

                //세부분류
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cSubcateogory"><span class="bold">'+LANG.SUBCATEGORY+'</span></label> <input type="text" id="cSubcateogory" name="cSubcateogory" value="'+cList[page].subCategory+'"></div>'

                //생년
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cBirthYear"><span class="bold">'+LANG.BIRTHYEAR+'</span></label> <input type="text" id="cBirthYear" name="cBirthYear" value="'+cList[page].lived[0]+'"></div>'

                //몰년
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cDeathYear"><span class="bold">'+LANG.DEATHYEAR+'</span></label> <input type="text" id="cDeathYear" name="cDeathYear" value="'+cList[page].lived[1]+'"></div>'

                //생일
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cBirthday"><span class="bold">'+LANG.BIRTHDAY+'</span></label> <input type="text" id="cBirthday" name="cBirthday" value="'+cList[page].birthday+'"></div>'

                //사명 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.GOAL+'</span> <span id="addGoal">'+LANG.ADDLINE+'</span> · <span id="deleteGoal">'+LANG.DELLINE+'</span></div><div id="goal" class="editordiv"></div>'

                //사명 (드롭다운)
                var temporaryGoalCount = cList[page].goal.length
                for (var i=0; i<cList[page].goal.length; i++) {
                    document.querySelector('#goal').innerHTML += '<div class="multiLineInput goal" id="cGoalEditor'+i+'"><label id="cGoalLabel'+i+'" for="cGoal'+i+'">'+(i+1)+' :</label> <input name="cGoal'+i+'" id="cGoal'+i+'"></div>'
                }

                //포지션 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.POSITION+'</span> <span id="addPosition">'+LANG.ADDLINE+'</span> · <span id="deletePosition">'+LANG.DELLINE+'</span></div><ul><li>'+LANG.cCHRONOLOGY+'</li><li>'+LANG.cYEARMONTH+'</li></ul><div id="position" class="editordiv"></div>'

                //포지션 (input 지옥)
                var position = Object.keys(cList[page].positionChronology)
                var temporaryPositionCount = position.length
                for (var i=0; i<position.length; i++) {
                    document.querySelector('#position').innerHTML += '<div class="multiLineInput" id="cPositionEditor'+i+'"><input class="key position" id="cPositionLabel'+i+'" name="cPositionLabel'+i+'" value="'+position[i]+'"> <input type="text" id="cPosition'+i+'" name="cPosition'+i+'" value="'+cList[page].positionChronology[position[i]]+'"></div>'
                }

                //사건 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.EVENT+'</span> <span id="addEvent">'+LANG.ADDLINE+'</span> · <span id="deleteEvent">'+LANG.DELLINE+'</span></div><ul><li>'+LANG.cCHRONOLOGY+'</li><li>'+LANG.cYEARMONTH+'</li></ul><div id="event" class="editordiv"></div>'

                //사건 (input 지옥)
                var event = Object.keys(cList[page].eventChronology)
                var temporaryEventCount = event.length
                for (var i=0; i<event.length; i++) {
                    document.querySelector('#event').innerHTML += '<div class="multiLineInput" id="cEventEditor'+i+'"><input class="key event" id="cEventLabel'+i+'" name="cEventLabel'+i+'" value="'+event[i]+'"> <input type="text" id="cEvent'+i+'" name="cEvent'+i+'" value="'+cList[page].eventChronology[event[i]]+'"></div>'
                }

                //요약
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.SUMMARY+'</h1><textarea class="summary" id="cSummary" name="cSummary">'+cList[page].summary+'</textarea>'

                //상세 정보
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.DESCRIPTION+'</h1><textarea id="cDescription" name="cDescription">'+cList[page].description+'</textarea>'

                //비밀 설정
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.SECRET+'</h1><textarea id="cSecret" name="cSecret">'+cList[page].secret+'</textarea>'

                //인간관계 (1차 틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><h1>'+LANG.RELATEDTO+'</h1><div><span id="addRelatedTo">'+LANG.ADDCATEGORY+'</span> · <span id="deleteRelatedTo">'+LANG.DELCATEGORY+'</span></div><br><div id="cRelatedTo"></div>'

                //인간관계 (2차 틀 생성 및 드롭다운)
                var relatedToKey = Object.keys(cList[page].relatedTo)
                var temporaryRelatedToCount = relatedToKey.length
                for (var i=0; i<temporaryRelatedToCount; i++) {
                    document.querySelector('#cRelatedTo').innerHTML += '<div class="editordiv" id="cRelatedToEditor'+i+'"><input class="key relatedTo" id="cRelatedToKey'+i+'" value="'+relatedToKey[i]+'"> <span id="addRelatedTo'+i+'" onclick="addRelatedTo('+i+')">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo'+i+'" onclick="deleteRelatedTo('+i+')">'+LANG.DELLINE+'</span><div id="relatedTo'+i+'" class="editordiv"></div></div>'

                    temporaryRelatedToCharacterCount.push(cList[page].relatedTo[relatedToKey[i]].length)
                    for (var l=0; l<cList[page].relatedTo[relatedToKey[i]].length; l++) {
                        document.querySelector('#relatedTo'+i).innerHTML += '<div class="multiLineInput" id="cRelatedToEditor'+i+'-'+l+'"><label id="cRelatedToLabel'+i+'-'+l+'" for="cRelatedTo'+i+'-'+l+'">'+(l+1)+' :</label> <select name="cRelatedTo'+i+'-'+l+'" id="cRelatedTo'+i+'-'+l+'"></select></div>'
                        for (var j=0; j<json.character.list.length; j++) {
                            if (cList[page].relatedTo[relatedToKey[l]] == j) {
                                document.querySelector('#cRelatedTo'+i+'-'+l).innerHTML += '<option value="'+j+'" selected>'+json.character.list[j].name+'</option>'
                            } else {
                                document.querySelector('#cRelatedTo'+i+'-'+l).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                            }
                        }
                    }
                }
                
                //확인 버튼
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold" id="confirm">'+LANG.CONFIRM+'</span> <span class="bold" id="cancel">취소</span>'

                //이벤트 리스너들
                document.querySelector('#cAvatar').addEventListener("input", (e) => {
                    document.querySelector('.cprofileavatar').innerHTML = '<img src="'+document.querySelector('#cAvatar').value.replace(/\/g, '')+'">'
                })

                //테마송 이벤트리스너
                document.querySelector('#addThemeSong').addEventListener("click", (e) => {
                    document.querySelector('#themeSong').innerHTML += '<div class="multiLineInput" id="cThemesongEditor'+temporaryThemeSongCount+'"><label id="cThemesongLabel'+temporaryThemeSongCount+'" for="cThemesong'+temporaryThemeSongCount+'">'+(temporaryThemeSongCount+1)+' :</label> <select name="cThemesong'+temporaryThemeSongCount+'" id="cThemesong'+temporaryThemeSongCount+'"></select></div>'
                    for (var j=0; j<json.themeSong.length; j++) {
                        document.querySelector('#cThemesong'+temporaryThemeSongCount).innerHTML += '<option value="'+j+'">'+json.themeSong[j].title+'</option>'
                    }
                    temporaryThemeSongCount += 1
                })
                document.querySelector('#deleteThemeSong').addEventListener("click", (e) => {
                    if (temporaryThemeSongCount > 0) {
                        temporaryThemeSongCount -= 1
                        document.querySelector('#cThemesongEditor'+temporaryThemeSongCount).remove()
                    }
                })

                //다른 이름들 이벤트리스너
                document.querySelector('#addNickname').addEventListener("click", (e) => {
                    document.querySelector('#nicknames').innerHTML += '<div class="multiLineInput" id="cNicknamesEditor'+temporaryNicknameCount+'"><input class="key nicknames" name="cNicknamesLabel'+temporaryNicknameCount+'" id="cNicknamesLabel'+temporaryNicknameCount+'" value="'+(temporaryNicknameCount+1)+'"> <input name="cNicknames'+temporaryNicknameCount+'" id="cNicknames'+temporaryNicknameCount+'"></div>'
                    temporaryNicknameCount += 1
                })
                document.querySelector('#deleteNickname').addEventListener("click", (e) => {
                    if (temporaryNicknameCount > 0) {
                        temporaryNicknameCount -= 1
                        document.querySelector('#cNicknamesEditor'+temporaryNicknameCount).remove()    
                    }
                })

                //사명 이벤트리스너
                document.querySelector('#addGoal').addEventListener("click", (e) => {
                    document.querySelector('#goal').innerHTML += '<div class="multiLineInput" id="cGoalEditor'+temporaryGoalCount+'"><label id="cGoalLabel'+temporaryGoalCount+'" for="cGoal'+temporaryGoalCount+'">'+(temporaryGoalCount+1)+' :</label>  <input name="cGoal'+temporaryGoalCount+'" id="cGoal'+temporaryGoalCount+'"></div>'
                    temporaryGoalCount += 1
                })

                document.querySelector('#deleteGoal').addEventListener("click", (e) => {
                    if (temporaryGoalCount > 0) {
                        temporaryGoalCount -= 1
                        document.querySelector('#cGoalEditor'+temporaryGoalCount).remove()    
                    }
                })

                //포지션 이벤트리스너
                document.querySelector('#addPosition').addEventListener("click", (e) => {
                    document.querySelector('#position').innerHTML += '<div class="multiLineInput" id="cPositionEditor'+temporaryPositionCount+'"><input class="key position" name="cPositionLabel'+temporaryPositionCount+'" id="cPositionLabel'+temporaryPositionCount+'" value="0.0"> <input name="cPosition'+temporaryPositionCount+'" id="cPosition'+temporaryPositionCount+'"></div>'
                    temporaryPositionCount += 1
                })
                document.querySelector('#deletePosition').addEventListener("click", (e) => {
                    if (temporaryPositionCount > 0) {
                        temporaryPositionCount -= 1
                        document.querySelector('#cPositionEditor'+temporaryPositionCount).remove()    
                    }
                })

                //사건 이벤트리스너
                document.querySelector('#addEvent').addEventListener("click", (e) => {
                    document.querySelector('#event').innerHTML += '<div class="multiLineInput" id="cEventEditor'+temporaryEventCount+'"><input class="key event" name="cEventLabel'+temporaryEventCount+'" id="cEventLabel'+temporaryEventCount+'" value="0.0"> <input name="cEvent'+temporaryEventCount+'" id="cEvent'+temporaryEventCount+'"></div>'
                    temporaryEventCount += 1
                })
                document.querySelector('#deleteEvent').addEventListener("click", (e) => {
                    if (temporaryEventCount > 0) {
                        temporaryEventCount -= 1
                        document.querySelector('#cEventEditor'+temporaryEventCount).remove()    
                    }
                })

                //인간관계 이벤트리스너

                //인간관계 (분류) 이벤트리스너
                document.querySelector('#addRelatedTo').addEventListener("click", (e) => {
                    document.querySelector('#cRelatedTo').innerHTML += '<div class="editordiv" id="cRelatedToEditor'+temporaryRelatedToCount+'"><input class="key relatedTo" value="" id="cRelatedToKey'+temporaryRelatedToCount+'"> <span id="addRelatedTo'+temporaryRelatedToCount+'" onclick="addRelatedTo('+temporaryRelatedToCount+')">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo'+temporaryRelatedToCount+'" onclick="deleteRelatedTo('+temporaryRelatedToCount+')">'+LANG.DELLINE+'</span><div id="relatedTo'+temporaryRelatedToCount+'" class="editordiv"></div></div>'
                    temporaryRelatedToCharacterCount.push(0)
                    temporaryRelatedToCount += 1
                })
                document.querySelector('#deleteRelatedTo').addEventListener("click", (e) => {
                    if (temporaryRelatedToCount > 0) {
                        temporaryRelatedToCount -= 1
                        temporaryRelatedToCharacterCount.pop()
                        document.querySelector('#cRelatedToEditor'+temporaryRelatedToCount).remove()
                    }
                })

                //확인 버튼 이벤트리스너
                document.querySelector('#confirm').addEventListener("click", (e) => {

                    //변수에 저장
                    var cAvatar = document.querySelector('#cAvatar').value.replace(/\/g, '')
                    var cName = document.querySelector('#cName').value.replace(/\/g, '')
                    var cMeaning = document.querySelector('#cMeaning').value.replace(/\/g, '')
                    var cNicknames = {}
                    for (var i=0; i < document.querySelectorAll('.key.nicknames').length; i++) {
                        var key = document.querySelector('#cNicknamesLabel'+i).value.replace(/\/g, '')
                        cNicknames[key] = document.querySelector('#cNicknames'+i).value.replace(/\/g, '')
                    }
                    var cBirthday = document.querySelector('#cBirthday').value.replace(/\/g, '')
                    var cLived = [parseInt(document.querySelector('#cBirthYear').value.replace(/\/g, '')), parseInt(document.querySelector('#cDeathYear').value.replace(/\/g, ''))]
                    var cCategory = document.querySelector('#cCategory').value.replace(/\/g, '')
                    var cSubcateogory = document.querySelector('#cSubcateogory').value.replace(/\/g, '')
                    var cEvent = {}
                    for (var i=0; i < document.querySelectorAll('.key.event').length; i++) {
                        var key = document.querySelector('#cEventLabel'+i).value.replace(/\/g, '')
                        cEvent[key] = document.querySelector('#cEvent'+i).value.replace(/\/g, '')
                    }
                    var cPosition = {}
                    for (var i=0; i < document.querySelectorAll('.key.position').length; i++) {
                        var key = document.querySelector('#cPositionLabel'+i).value.replace(/\/g, '')
                        cPosition[key] = document.querySelector('#cPosition'+i).value.replace(/\/g, '')
                    }
                    var cRelatedTo = {}
                    for (var i=0; i < document.querySelectorAll('.key.relatedTo').length; i++) {
                        var key = document.querySelector('#cRelatedToKey'+i).value.replace(/\/g, '')
                        cRelatedTo[key] = []
                        for (var j=0; j < document.querySelectorAll('#relatedTo'+i).length; j++) {
                            cRelatedTo[key][j] = document.querySelector('#cRelatedTo'+i+'-'+j).value.replace(/\/g, '')
                        }
                    }
                    var cGoal = []
                    for (var i=0; i < document.querySelectorAll('.goal').length; i++) {
                        cGoal[i] = document.querySelector('#cGoal'+i).value.replace(/\/g, '')
                    }
                    var cThemesong = []
                    for (var i=0; i < document.querySelectorAll('.themeSong').length; i++) {
                        cThemesong[i] = document.querySelector('#cThemesong'+i).value.replace(/\/g, '')
                    }
                    var cSummary = document.querySelector('#cSummary').value.replace(/\/g, '')
                    var cDescription = document.querySelector('#cDescription').value.replace(/\/g, '')
                    var cSecret = document.querySelector('#cSecret').value.replace(/\/g, '')
                    var cHashtag = document.querySelector('#cHashtag').value.replace(/\/g, '')
                    
                    var updatedJsonCharacterProfile = {
                        "avatar": cAvatar,
                        "name": cName,
                        "meaning": cMeaning,
                        "nickname": cNicknames,
                        "birthday": cBirthday,
                        "lived": cLived,
                        "category": cCategory,
                        "subCategory": cSubcateogory,
                        "eventChronology": cEvent,
                        "positionChronology": cPosition,
                        "relatedTo": cRelatedTo,
                        "goal": cGoal,
                        "themeSong": cThemesong,
                        "summary": cSummary,
                        "description": cDescription,
                        "secret": cSecret,
                        "hashtag": cHashtag
                    }
                    json.character.list[page] = updatedJsonCharacterProfile
                    
                    localStorage.setItem('json', JSON.stringify(json))
                    var updatePageUrl = 'https://'+MISSKEYHOST+'/api/pages/update'
                    var updatePageParam = {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            i: token,
                            pageId: jsonPageId,
                            title: 'CabinetKey.json',
                            name: 'CabinetKey.json',
                            summary: 'CabinetKey.json',
                            variables: [],
                            script: '',
                            content: [{
                                text: '```\n'+JSON.stringify(json)+'\n```',
                                type: 'text'
                            }]
                        })
                    }
                    fetch(updatePageUrl, updatePageParam)
                    .then(() => {
                        isSaved = true
                        location.href = './?page='+page
                    })

                })

                document.querySelector('#cancel').addEventListener("click", (e) => {
                    location.href = './?page='+page
                })
                
            } else {
                document.querySelector('#popup-content').innerHTML = '<div class="characterprofile"></div>'
                document.querySelector('#popup-content').innerHTML += '<div class="relatedcharacterlist"></div>'
                document.querySelector('#popup-content').innerHTML += '<div id="collectiontitle"></div>'
                document.querySelector('#popup-content').innerHTML += '<div id="collectionlist"><div id="worktitle"></div><div id="worklist" class="collectionlist"></div><div id="workqid" class="collectionqid"></div><div id="drafttitle"></div><div id="draftlist" class="collectionlist"></div><div id="draftqid" class="collectionqid"></div></div>'
    
                document.querySelector('.characterprofile').innerHTML = '<h1 class="cprofilename">'+cList[page].name+'</h1>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofileavatar"><img src="'+cList[page].avatar+'"><div>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilesong"><div><span class="bold">테마 송</span> </div></div>'
                for (var i=0; i<(cList[page].themeSong.length); i++) {
                    document.querySelector('.cprofilesong').innerHTML += '<li><a href="./?page=song'+cList[page].themeSong[i]+'">'+json.themeSong[cList[page].themeSong[i]].title+'</a></li>'
                }
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilecategory"><span class="bold">'+LANG.MEANING+'</span> '+cList[page].meaning+'<div>'
                var nicknames = Object.keys(cList[page].nickname)
                for (var i=0; i<nicknames.length; i++) {
                    document.querySelector('.characterprofile').innerHTML += '<div class="cprofilecategory"><span class="bold">'+nicknames[i]+'</span> '+cList[page].nickname[nicknames[i]]+'<div>'
                }
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilecategory"><span class="bold">'+LANG.CATEGORY+'</span> <a href="./?category='+cList[page].category+'">'+json.character.category[cList[page].category]+'</a><div>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilesubcategory"><span class="bold">'+LANG.SUBCATEGORY+'</span> '+cList[page].subCategory+'<div>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilelived"><span class="bold">'+LANG.LIVEDYEAR+'</span> '+cList[page].lived[0]+'~'+cList[page].lived[1]+'<div>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilebirthday"><span class="bold">'+LANG.BIRTHDAY+'</span> '+cList[page].birthday+'<div>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilegoal"><div><span class="bold">'+LANG.GOAL+'</span> </div></div>'
                for (var i=0; i<(cList[page].goal.length); i++) {
                    document.querySelector('.cprofilegoal').innerHTML += '<li>'+cList[page].goal[i]+'</li>'
                }
                var hideandseek = true
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofiletable"><div><span class="bold">'+LANG.CRONOLOGY+'</span> <span id="hideChronology">'+LANG.FOLD+'</span></div><table class="chronology"><tr><th>'+LANG.YEAR+'</th><th>'+LANG.POSITION+'</th><th>'+LANG.EVENT+'</th></tr></table><div>'
    
                for (var i=0; i<(cList[page].lived[1] - cList[page].lived[0] + 1); i++) {
                    if (json.info.mainYear.includes(parseInt(cList[page].lived[0])+i)) {
                        for (var j=0; j<12; j++){
                            var key = (parseInt(cList[page].lived[0])+i)+'.'+(j+1)
                            var position = cList[page].positionChronology[key]
                            var event1 = cList[page].eventChronology[key]
                            if (!position) { position = '' }
                            if (!event1) { event1 = '' }
                            document.querySelector('.chronology').innerHTML += '<tr class="mainyear"><td>'+(key)+'</td><td>'+position+'</td><td>'+event1+'</td></tr>'
                        }
                    } else {
                        var key = (parseInt(cList[page].lived[0])+i)
                        var position = cList[page].positionChronology[key]
                        var event1 = cList[page].eventChronology[key]
                        if (!position) { position = '' }
                        if (!event1) { event1 = '' }
                        document.querySelector('.chronology').innerHTML += '<tr class="subyear"><td>'+key+'</td><td>'+position+'</td><td>'+event1+'</td></tr>'
                    }
                }
                document.querySelector('.characterprofile').innerHTML += '<h1>'+LANG.SUMMARY+'</h1>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilesummary">'+cList[page].summary+'<div>'
                document.querySelector('.characterprofile').innerHTML += '<h1>'+LANG.DESCRIPTION+'</h1>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofiledescription">'+parseMd(cList[page].description)+'<div>'
                var hideandsecret = true
                document.querySelector('.characterprofile').innerHTML += '<h1>'+LANG.SECRET+'</h1>'
                document.querySelector('.characterprofile').innerHTML += '<div><span id="hideSecret">'+LANG.FOLD+'</span>'
                document.querySelector('.characterprofile').innerHTML += '<div class="cprofilesecret">'+parseMd(cList[page].secret)+'<div>'
    
                document.querySelector('.characterprofile').innerHTML += '<h1>'+LANG.RELATEDTO+'</h1>'
    
                var relatedCategory = Object.keys(json.character.list[page].relatedTo)
                for (var i = 0; i < relatedCategory.length; i++) {
                    document.querySelector('.relatedcharacterlist').innerHTML += '<div class="relatedcharactercategory" id="relatedcategory'+i+'">'+relatedCategory[i]+'</div>'
                    document.querySelector('.relatedcharacterlist').innerHTML += '<div class="relatedcharactercategorylist" id="relatedlist'+i+'"></div>'
                    var relatedCategorylist = json.character.list[page].relatedTo[relatedCategory[i]]
                    for (var j = 0; j < relatedCategorylist.length; j++) {
                        document.querySelector('#relatedlist'+i).innerHTML += '<a href="./?page='+relatedCategorylist[j]+'"><div class="characteritem" onmouseover="hoverCharacter('+relatedCategorylist[j]+')"><div><img src="'+cList[relatedCategorylist[j]].avatar+'" class="cavatar"></div><div class="cname">'+cList[relatedCategorylist[j]].name+'</div><div class="csummary">'+cList[relatedCategorylist[j]].summary+'</div></div></a>'
                    }
                }
    
                var workHashTagQuery = [[LANG.FINISHEDWORK, json.info.mainHashtag, cList[page].hashtag]]
                if (workHashTagQuery[0][0] != '') {
                    document.querySelector('#collectiontitle').innerHTML = '<h1>관련 작품 모음</h1>'
                    document.querySelector('#worktitle').innerHTML = '<h2>'+LANG.FINISHEDWORK+'</h2>'
                    document.querySelector('#drafttitle').innerHTML = '<h2>'+LANG.DRAFT+'</h2>'
    
                    var findArtsUrl = 'https://'+MISSKEYHOST+'/api/notes/search-by-tag'
                    var findArtsParam
                    if (!workqid || workqid == 0 ) {
                        findArtsParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                query: workHashTagQuery,
                                limit: 5
                            })
                        }
                        document.querySelector('#workqid').innerHTML = '0 · <a href="./?page='+page+'&qid='+1+','+draftqid+'">'+LANG.NEXT+'</a>'
                    } else {
                        findArtsParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                query: workHashTagQuery,
                                limit: 5,
                                untilId: await fetchAgain(workqid, workHashTagQuery)
                            })
                        }
                        document.querySelector('#workqid').innerHTML = '<a href="./?page='+page+'&qid='+(workqid-1)+','+draftqid+'">'+LANG.PREV+'</a> · '+workqid+' · <a href="./?page='+page+'&qid='+(workqid+1)+','+draftqid+'">'+LANG.NEXT+'</a>'
                    }
                    fetch(findArtsUrl, findArtsParam)
                    .then((artsData) => {return artsData.json()})
                    .then((artsRes) => {
                        for (var i = 0; i<artsRes.length; i++){
                            if (artsRes[i].user.username == MISSKEYUSER) {
                                if (artsRes[i].files.length == 0) {
                                    document.querySelector('#worklist').innerHTML += '<div class="collectionel"><a href="./?note='+artsRes[i].id+'"><div class="overflowhidden" id="work'+i+'"></div></a></div>'
                                    if (artsRes[i].cw) document.querySelector('#work'+i).innerHTML = '</h1>'+artsRes[i].cw+'</h1>'
                                    document.querySelector('#work'+i).innerHTML += parseMd(artsRes[i].text)
                                } else {
                                    document.querySelector('#worklist').innerHTML += '<div class="collectionel"><a href="./?note='+artsRes[i].id+'"><img src="'+artsRes[i].files[0].url+'"></a></div>'
                                }
                            }
                        }
                    })
    
                    var draftHashTagQuery = [[LANG.DRAFT, json.info.mainHashtag, cList[page].hashtag]]
                    var findDraftsUrl = 'https://'+MISSKEYHOST+'/api/notes/search-by-tag'
                    var findDraftsParam
                    if (!draftqid || draftqid == 0 ) {
                        findDraftsParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                query: draftHashTagQuery,
                                limit: 5
                            })
                        }
                        document.querySelector('#draftqid').innerHTML = '0 · <a href="./?page='+page+'&qid='+(workqid)+','+(draftqid+1)+'">'+LANG.NEXT+'</a>'
                    } else {
                        findDraftsParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                query: draftHashTagQuery,
                                userId: MISSKEYID,
                                limit: 5,
                                untilId: await fetchAgain(draftqid, draftHashTagQuery)
                            })
                        }
                        document.querySelector('#draftqid').innerHTML = '<a href="./?page='+page+'&qid='+(workqid)+','+(draftqid-1)+'">'+LANG.PREV+'</a> · '+draftqid+' · <a href="./?page='+page+'&qid='+(workqid)+','+(draftqid+1)+'">'+LANG.NEXT+'</a>'
                    }
                    fetch(findDraftsUrl, findDraftsParam)
                    .then((draftsData) => {return draftsData.json()})
                    .then((draftsRes) => {
                        for (var i = 0; i<draftsRes.length; i++){
                            if (draftsRes[i].user.username == MISSKEYUSER) {
                                if (draftsRes[i].files.length == 0) {
                                    document.querySelector('#draftlist').innerHTML += '<div class="collectionel"><a href="./?note='+draftsRes[i].id+'"><div class="overflowhidden" id="draft'+i+'"></div></a></div>'
                                    if (draftsRes[i].cw) document.querySelector('#draft'+i).innerHTML = '</h1>'+draftsRes[i].cw+'</h1>'
                                    document.querySelector('#draft'+i).innerHTML += parseMd(draftsRes[i].text)
                                } else {
                                    document.querySelector('#draftlist').innerHTML += '<div class="collectionel"><a href="./?note='+draftsRes[i].id+'"><img src="'+draftsRes[i].files[0].url+'"></a></div>'
                                }
                            }
                        }
                    })
                }
    
                document.querySelector('#hideChronology').addEventListener("click", (e) => {
                    var els = document.querySelectorAll('.subyear')
                    if (hideandseek) {
                        for (var el=0; el<els.length; el++) {
                            els[el].style.display = "table-row";
                        }
                        hideandseek = false
                    } else {
                        for (var el=0; el<els.length; el++) {
                            els[el].style.display = "none";
                        }
                        hideandseek = true
                    }
                })

                document.querySelector('#hideSecret').addEventListener("click", (e) => {
                    if (hideandsecret) {
                        document.querySelector('.cprofilesecret').style.display = 'block'
                        hideandsecret = false
                    } else {
                        document.querySelector('.cprofilesecret').style.display = 'none'
                        hideandsecret = true
                    }
                })
            }
        }
    } else if (note && !page) {

        //개별 노트 표시.

        loadBackground(json)
        document.querySelector('#wrapper').addEventListener("click", (e) => {
            location.href = './'
        })
        document.querySelector('#popup-content').style.display = 'block'

        document.querySelector('#popup-content').innerHTML = '<div class="collection"></div>'
        
        document.querySelector('.collection').innerHTML += '<h1 class="collectiontitle">UNTITLED</h1>'
        document.querySelector('.collection').innerHTML += '<div class="collectionnote"><div>'

        var findNotesUrl = 'https://'+MISSKEYHOST+'/api/notes/show'
        var findNotesParam

        if (isLogin) {
            findNotesParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    i: token,
                    noteId: note,
                })
            }
        } else {
            findNotesParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    noteId: note,
                })
            }
        }
        fetch(findNotesUrl, findNotesParam)
        .then((notesData) => {return notesData.json()})
        .then((notesRes) => {

            if (mode == 'edit' && isLogin) {

                var isSaved = false
                window.onbeforeunload = function(){
                    if (!isSaved) {
                        return ' '
                    }
                }

                document.querySelector('#popup-content').innerHTML = '<div class="editform"></div>'
                document.querySelector('.editform').innerHTML = '<h1>'+LANG.EDITWORK+'</h1>'
    
                //제목
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><label for="cTitle"><span class="bold">'+LANG.TITLE+'</span></label> <input type="text" id="cTitle" name="cTitle" value="'+notesRes.cw+'"></div>'
    
                //완성작 및 초안 선택
                if (notesRes.tags.includes(LANG.FINISHEDWORK)) {
                    document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.WORKTYPE+'</span> <select name="cType" id="cType"><option value=" #'+LANG.FINISHEDWORK+'" selected>'+LANG.FINISHEDWORK+'</option><option value=" #'+LANG.DRAFT+'">'+LANG.DRAFT+'</option></select></div>'
                } else if (notesRes.tags.includes(LANG.DRAFT)) {
                    document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.WORKTYPE+'</span> <select name="cType" id="cType"><option value=" #'+LANG.FINISHEDWORK+'">'+LANG.FINISHEDWORK+'</option><option value=" #'+LANG.DRAFT+'" selected>'+LANG.DRAFT+'</option></select></div>'
                }

                //연관 캐릭터 (틀 생성)
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.RELATEDTO+'</span> <span id="addRelatedTo">'+LANG.ADDLINE+'</span> · <span id="deleteRelatedTo">'+LANG.DELLINE+'</span></div><div id="relatedTo" class="editordiv"></div>'

                var relatedCharacter = []
                for (var i=0; i<json.character.list.length; i++) {
                    if (notesRes.tags.includes(json.character.list[i].hashtag)) {
                        relatedCharacter.push(i)
                    }
                }

                //연관 캐릭터 (드롭다운)
                var temporaryRelatedToCount = relatedCharacter.length
                for (var i=0; i<relatedCharacter.length; i++) {
                    document.querySelector('#relatedTo').innerHTML += '<div class="multiLineInput relatedTo" id="cRelatedToEditor'+i+'"><label id="cRelatedToLabel'+i+'" for="cRelatedTo'+i+'">'+(i+1)+' :</label> <select name="cRelatedTo'+i+'" id="cRelatedTo'+i+'"></select></div>'
                    for (var j=0; j<json.character.list.length; j++) {
                        if (relatedCharacter[i] == j) {
                            document.querySelector('#cRelatedTo'+i).innerHTML += '<option value="'+j+'" selected>'+json.character.list[j].name+'</option>'
                        } else {
                            document.querySelector('#cRelatedTo'+i).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                        }
                    }
                }
    
                //공개 범위 (홈, 홈로컬, 비공개)
                if (notesRes.visibility == 'home' && !notesRes.localOnly) {
                    document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.VISIBILITY+'</span> <select name="cVisibility" id="cVisibility"><option value="home" selected>'+LANG.vHOME+'</option><option value="local">'+LANG.vHOMELOCAL+'</option><option value="specified">'+LANG.vSPECIFIED+'</option></select></div>'
                } else if (notesRes.visibility == 'home' && notesRes.localOnly) {
                    document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.VISIBILITY+'</span> <select name="cVisibility" id="cVisibility"><option value="home">'+LANG.vHOME+'</option><option value="local" selected>'+LANG.vHOMELOCAL+'</option><option value="specified">'+LANG.vSPECIFIED+'</option></select></div>'
                } else if (notesRes.visibility == 'specified') {
                    document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold">'+LANG.VISIBILITY+'</span> <select name="cVisibility" id="cVisibility"><option value="home">'+LANG.vHOME+'</option><option value="local">'+LANG.vHOMELOCAL+'</option><option value="specified" selected>'+LANG.vSPECIFIED+'</option></select></div>'
                }
    
                //내용
                var noteText = notesRes.text.split('\n\n')
                noteText.pop()
                noteText = noteText.join('\n\n')
                document.querySelector('.editform').innerHTML += '<textarea id="cContent" name="cContent">'+noteText+'</textarea>'
    
                //파일첨부
                document.querySelector('.editform').innerHTML += '<div class="editordiv" id="imgUploader"></div><input type="file" id="imgRealUpload" accept="image/*" style="display: none;">'
                
                fileCount.l = notesRes.fileIds.length
                for (var i=0; i<notesRes.fileIds.length; i++) {
                    document.querySelector('#imgUploader').innerHTML += '<div id="imgUploadFrame'+i+'" onclick="deleteFile(this);"><span class="bold">'+LANG.ADDFILE+'</span> <span class="imgUploaded" id="imgUploaded'+i+'">'+notesRes.fileIds[i]+'</span></div>'
                }

                document.querySelector('#imgUploader').innerHTML += '<div id="imgUploadFrame' +fileCount.l+'" onclick="deleteFile(this);"><span class="bold">'+LANG.ADDFILE+'</span> <span id="imgUpload">'+LANG.CLICK+'</span></div>'
    
                //확인 버튼
                document.querySelector('.editform').innerHTML += '<div class="editordiv"><span class="bold" id="confirm">'+LANG.CONFIRM+'</span> <span class="bold" id="cancel">취소</span>'
    
                //연관 캐릭터 이벤트 리스너
                document.querySelector('#addRelatedTo').addEventListener("click", (e) => {
                    document.querySelector('#relatedTo').innerHTML += '<div class="multiLineInput" id="cRelatedToEditor'+temporaryRelatedToCount+'"><label id="cRelatedToLabel'+temporaryRelatedToCount+'" for="cRelatedTo'+temporaryRelatedToCount+'">'+(temporaryRelatedToCount+1)+' :</label> <select name="cRelatedTo'+temporaryRelatedToCount+'" id="cRelatedTo'+temporaryRelatedToCount+'" class="relatedTo" ></select></div>'
                    for (var j=0; j<json.character.list.length; j++) {
                        document.querySelector('#cRelatedTo'+temporaryRelatedToCount).innerHTML += '<option value="'+j+'">'+json.character.list[j].name+'</option>'
                    }
                    temporaryRelatedToCount += 1
                })
                document.querySelector('#deleteRelatedTo').addEventListener("click", (e) => {
                    if (temporaryRelatedToCount > 0) {
                        temporaryRelatedToCount -= 1
                        document.querySelector('#cRelatedToEditor'+temporaryRelatedToCount).remove()
                    }
                })
    
                //이미지 업로드버튼
                var imgUpload = document.querySelector('#imgUpload')
                var imgRealUpload = document.querySelector('#imgRealUpload')
                imgUpload.addEventListener('click', () => imgRealUpload.click())
                imgRealUpload.addEventListener('change', function(e) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var blob = window.dataURLtoBlob(reader.result)
                        const formData = new FormData()
                        formData.append('file', blob, {
                            filename: 'untitled.png',
                            contentType: 'image/png',
                        });
                        formData.append("i", token)
                        
                        var imgUploadURL = 'https://'+MISSKEYHOST+'/api/drive/files/create'
                        var imgUploadParam = {
                            method: 'POST',
                            headers: {
                            },
                            body: formData
                        }
                        fetch(imgUploadURL, imgUploadParam)
                        .then((imgData) => {return imgData.json()})
                        .then((imgRes) => {
                            document.querySelector('#imgUpload').innerText = imgRes.id
                            document.querySelector('#imgUpload').classList.add('imgUploaded')
                            document.querySelector('#imgUpload').id = 'imgUploaded'+fileCount.l
                            fileCount.l += 1

                            document.querySelector('#imgUploader').innerHTML += '<div id="imgUploadFrame'+fileCount.l+'" onclick="deleteFile(this);"><span class="bold">'+LANG.ADDFILE+'</span> <span id="imgUpload">'+LANG.CLICK+'</span></div>'

                            document.querySelector('#imgUpload').addEventListener('click', () => imgRealUpload.click())
                        })
                        .catch(err => {throw err});
                        
                    }
                    reader.readAsDataURL(this.files[0])
                })
    
                //확인버튼 이벤트리스너
                document.querySelector('#confirm').addEventListener("click", (e) => {
    
                    var cTitle = document.querySelector('#cTitle').value.replace(/\/g, '')
                    var cType = document.querySelector('#cType').value.replace(/\/g, '')
                    var cRelatedTo = []
                    for (var j=0; j < document.querySelectorAll('.relatedTo').length; j++) {
                        var cIndex = parseInt(document.querySelector('#cRelatedTo'+j).value.replace(/\/g, ''))
                        cRelatedTo[j] = json.character.list[cIndex].hashtag
                    }
                    var cRelatedText = cRelatedTo.join(' #')
                    var cVisibility = document.querySelector('#cVisibility').value.replace(/\/g, '')
                    if (cVisibility == 'home' || cVisibility == 'specified') {
                        cLocalOnly = false
                    } else {
                        cLocalOnly = true
                        cVisibility = 'home'
                    }
                    var cContent = document.querySelector('#cContent').value.replace(/\/g, '')
                    var cFile = []
                    for (var i=0; i < Math.min(document.querySelectorAll('.imgUploaded').length, 16); i++) {
                        cFile.push(document.querySelector('#imgUploaded'+i).innerText)
                    }
                    
                    var createNoteUrl = 'https://'+MISSKEYHOST+'/api/notes/create'
                    var createNoteParam
                    if (cFile.length > 0) {
                        createNoteParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                i: token,
                                cw: cTitle,
                                text: cContent+'\n\n#'+cRelatedText+' #'+json.info.mainHashtag+cType+' @cabinetkey@a.gup.pe',
                                visibility: cVisibility,
                                localOnly: cLocalOnly,
                                fileIds: cFile
                            })
                        }
                    } else {
                        createNoteParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                i: token,
                                cw: cTitle,
                                text: cContent+'\n\n#'+cRelatedText+' #'+json.info.mainHashtag+cType+' @cabinetkey@a.gup.pe',
                                visibility: cVisibility,
                                localOnly: cLocalOnly,
                            })
                        }
                    }
                    fetch(createNoteUrl, createNoteParam)
                    .then((noteData) => { return noteData.json() })
                    .then((noteRes) => {

                        var deleteNoteUrl = 'https://'+MISSKEYHOST+'/api/notes/delete'
                        var deleteNoteParam = {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                i: token,
                                noteId: note
                            })
                        }
                        fetch(deleteNoteUrl, deleteNoteParam)
                        .then((res) => { 
                            isSaved = true
                            location.href = './?note='+noteRes.createdNote.id
                        })
                    })
                })

                document.querySelector('#cancel').addEventListener("click", (e) => {
                    location.href = './?page='+page
                })
            } else {

                if (notesRes.cw) document.querySelector('.collectiontitle').innerText = notesRes.cw

                document.querySelector('.collectionnote').innerHTML = '<div class="createdAt">'+notesRes.createdAt+'</div>'
                document.querySelector('.collectionnote').innerHTML += '<div class="createdAt"><span class="bold"><a href="https://'+MISSKEYHOST+'/notes/'+notesRes.id+'">'+LANG.READONREMOTE+'</a></span></div>'

                if (notesRes.files.length > 0) {
                    for (var i = 0; i<notesRes.files.length; i++) {
                        document.querySelector('.collectionnote').innerHTML += '<div><img src="'+notesRes.files[i].url+'"></div>'
                    }
                }
                document.querySelector('.collectionnote').innerHTML += '<div class="noteContent">'+parseMd(notesRes.text)+'</div><hr>'
                document.querySelector('.collectionnote').innerHTML += '<div class="reactionList"></div>'
                for (var i = 0; i<Object.keys(notesRes.reactions).length; i++) {
                    var emojiName = Object.keys(notesRes.reactions)[i]
                    if (emojiName.includes('@')) {
                        var emojiHost
                        if (emojiName.split('@')[1] == '.:') {
                            emojiHost = MISSKEYHOST
                        } else {
                            emojiHost = emojiName.split('@')[1].split(':')[0]
                        }
                        var emojiFetchUrl = 'https://'+emojiHost+'/api/emoji?name='+emojiName.split('@')[0].split(':')[1]
                        var emojiFetchParam = {
                            method: 'GET',
                            headers: {
                                'content-type': 'application/json',
                            },
                        }
                        fetch(emojiFetchUrl, emojiFetchParam)
                        .then((emojiData) => {return emojiData.json()})
                        .then((emojiRes) => {
                            document.querySelector('.reactionList').innerHTML += '<span class="bold"><img src="'+emojiRes.url+'" class="emoji"> '+notesRes.reactions[emojiName]+'</span> '
                        })
                    } else {
                        document.querySelector('.reactionList').innerHTML += '<span class="bold"><span class="emoji">'+emojiName+'</span> '+notesRes.reactions[emojiName]+'</span>'
                    }
                }
                document.querySelector('.collectionnote').innerHTML += '<div class="replyList"></div>'
                var findReplysUrl = 'https://'+MISSKEYHOST+'/api/notes/replies'
                var findReplysParam = {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        noteId: note,
                    })
                }
                fetch(findReplysUrl, findReplysParam)
                .then((replyData) => {return replyData.json()})
                .then((replyRes) => {
                    for (var i = 0; i<Object.keys(notesRes.reactions).length; i++) {
                        document.querySelector('.replyList').innerHTML += '<hr><div class="replyel" id="replyid'+i+'"></div>'
                        document.querySelector('#replyid'+i).innerHTML += '<div>'+replyRes[i].text+'</div>'
                        document.querySelector('#replyid'+i).innerHTML += '<div class="replyProfile"><span> ー by</span><img class="emoji" src="'+replyRes[i].user.avatarUrl+'"><span>'+replyRes[i].user.name.replace(/\:([^\:\s]+)\:/g, '').replace(/\s\s/g, ' ')+'</span><span class="bold" style="font-size: 0.8em;"><a href="https://'+MISSKEYHOST+'/notes/'+replyRes[i].id+'">'+LANG.READONREMOTE+'</a></span></div>'
                    }
                })
            }
        })
    }
}

async function findJSON() {
    var findUserIdUrl = 'https://'+MISSKEYHOST+'/api/users/search-by-username-and-host'
    var findUserIdParam = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body:  JSON.stringify({
            username: MISSKEYUSER,
            host: MISSKEYHOST,
        })
    }
    const userData = await fetch(findUserIdUrl, findUserIdParam)
    const userRes = await userData.json()
    if (userRes.length > 0) {
        MISSKEYID = userRes[0].id
        localStorage.setItem('misskeyId', MISSKEYID)

        var findInfoUrl = 'https://'+MISSKEYHOST+'/api/notes/search'
        var findInfoParam = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                query: 'CabinetKey_Setup',
                userId: MISSKEYID,
            })
        }
        const infoData = await fetch(findInfoUrl, findInfoParam)
        const infoRes = await infoData.json()

        if (infoRes.length == 1) {
            const MISSKEYSETUPID = infoRes[0].id
            const MISSKEYJSONID = infoRes[0].text.split('`')[1]
            localStorage.setItem('jsonPageId', MISSKEYJSONID)

            var jsonInfoUrl = 'https://'+MISSKEYHOST+'/api/pages/show'
            var jsonInfoParam = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    pageId: MISSKEYJSONID
                })
            }
            
            const pageData = await fetch(jsonInfoUrl, jsonInfoParam)
            const pageRes = await pageData.json()
            if (!pageRes.content) {
                json = example
            } else {
                json = JSON.parse(pageRes.content[0].text.split('```')[1])
                localStorage.setItem('json', JSON.stringify(json))
            }
        } else if (infoRes.length > 1) {
            alert(LANG.cDUPLICATEDSETUPNOTES)
            json = example
        } else {
            json = example
        }
    } else {
        json = example
    }
    return json
}

async function updateJSON() { 
    const json = await findJSON()
    await parseYourJSON(json)
}

if (json) {
    parseYourJSON(json)
} else {
    updateJSON()
}