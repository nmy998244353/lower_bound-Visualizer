let X = 0
let b = []
let cntr = document.createElement('p')
let idxs = []
let id = 0
let btns = document.getElementById('btns')
let ans = document.getElementById('ans')

function input(){
    //初期化
    let hj = document.getElementById('hyoji')
    let tbl = document.createElement('table')
    let rw = document.createElement('tr')
    cntr = document.createElement('p')
    while(rw.hasChildNodes()) rw.removeChild(rw.firstChild)
    while(tbl.hasChildNodes()) tbl.removeChild(tbl.firstChild)
    while(hj.hasChildNodes()) hj.removeChild(hj.firstChild)
    while(cntr.hasChildNodes()) cntr.removeChild(cntr.firstChild)
    while(btns.hasChildNodes()) btns.removeChild(btns.firstChild)
    b = []
    idxs = []
    id = 0

    //基準値をXに代入
    X = document.getElementById('X').value

    //色の説明を挿入
    hyoji.insertAdjacentHTML(
        'beforeEnd',
        `<p>
            <span>白:未定,</span>
            <span class="NG">ピンク:${X}未満</span>
            <span class="OK">水色:${X}以上,</span>
        </p>`
    )

    //入力をパースしてbに追加
    let tmp = document.getElementById('seq')
    line = tmp.value
    line = line.replace(/\s+/g, '')
    line = line.replace(/,+/g, ',')
    if(line[line.length-1]==','){
        line = line.replace(/.$/, '')
    }
    let a = line.split(',')
    for(let i=0; i < a.length; i++){
        b.push(parseInt(a[i]))
        if(isNaN(b[i])){
            hyoji.insertAdjacentHTML('beforeend', '<p>無効な入力です</p>')
            return 
        }
    }
    b.sort((a, b) => a - b)

    //bをtableに表示
    for(let i=0; i < b.length; i++){
        let txt = document.createTextNode(b[i])
        let cl = document.createElement('td')
        cl.id = i
        cl.className = 'waiting'
        cl.append(txt)
        rw.append(cl)
    }
    tbl.append(rw)
    hj.appendChild(tbl)

    //二分探索を実行
    lowerbound()

    //操作回数を表示
    cntr.append(document.createTextNode('操作回数：0'))
    hj.prepend(cntr)
    //表を表示
    disp()
}

function lowerbound(){
    let l = -1, r = b.length
    id = 1
    idxs = [[1,-1],[l,r]]
    while(r-l > 1){
        m = Math.floor((r+l)/2)
        if(m < 0 || b[m] < X){
            l = m;
        }else{
            r = m;
        }
        idxs.push([l,r])
    }
}

function disp(){
    let btns = document.getElementById('btns')
    while(btns.hasChildNodes()) btns.removeChild(btns.firstChild)
    while(ans.hasChildNodes()) ans.removeChild(ans.firstChild)
    let l = idxs[id][0]
    let r = idxs[id][1]
    for(let i=0; i <= l; i++){
        document.getElementById(i).className='NG'
    }
    for(let i=l+1; i < r; i++){
        document.getElementById(i).className='waiting'
    }
    for(let i = r; i < b.length; i++){
        document.getElementById(i).className='OK'
    }
    {
        let btn = document.createElement('input')
        btn.value = '戻る'
        btn.type = 'button'
        btn.id = 'bac'
        btn.onclick = bac
        if(id <= 1) btn.disabled='true'
        btns.appendChild(btn)
    }
    {
        let btn = document.createElement('input')
        btn.value = '次へ'
        btn.type = 'button'
        btn.id = 'nex'
        btn.onclick = nex
        if(id+1 >= idxs.length){
            btn.disabled='true'
            let tmp_r = idxs[idxs.length-1][1]
            let txt = document.createTextNode('')
            if(tmp_r==b.length){
                txt = document.createTextNode(`${X}以上要素はありません`)
            }else{
                txt = document.createTextNode(`${X}以上の最小の要素は${b[tmp_r]}です`)
            }
            ans.append(txt)
        }
        btns.appendChild(btn)
    }
}

function nex(){
    id++
    disp()
    while(cntr.hasChildNodes()) cntr.removeChild(cntr.firstChild)
    cntr.append(document.createTextNode(`操作回数：${id-1}`))
}

function bac(){
    id--
    disp()
    while(cntr.hasChildNodes()) cntr.removeChild(cntr.firstChild)
    cntr.append(document.createTextNode(`操作回数：${id-1}`))
}