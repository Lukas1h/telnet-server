import fetch from 'node-fetch'
global.fetch = fetch;
import { createApi } from 'unsplash-js';

import youtubedl from 'youtube-dl-exec'
import create from 'prompt-sync';
import { exec, spawn } from "child_process"
let prompt = create();




const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '4053e75025msh7102c96f9e3675fp1a50abjsn59b783dbda2f',
        'X-RapidAPI-Host': 'youtube-search-results.p.rapidapi.com'
    }
};
const service = process.argv[2]
const search = process.argv[3]

if(service == "us"){
    const unsplash = createApi({
        accessKey: '8m1k-HbbMnLRrNUrxz5X7RdjTbq0tX-lxbAb8X4rSis',
        fetch: fetch,
    });
    unsplash.search.getPhotos({
        query: search,
        page: 1,
        perPage: 1,
    }).then((value=>{
        console.log(value.response.results[0].urls.regular)
        const u = value.response.results[0].urls.regular
        const ls = spawn("timg", ["-pq", "" + u + ""], { stdio: 'inherit' });
    }))

}

if (service == "yt"){
    fetch('https://youtube-search-results.p.rapidapi.com/youtube-search/?q=' + search, options)
        .then(response => response.json())
        .then(response => {
            //        console.log(response)
            const vurl = response.items[0].url
            const urla = 'https://youtube-search-and-download.p.rapidapi.com/video?id=' + youtube_parser(vurl);

            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': '4053e75025msh7102c96f9e3675fp1a50abjsn59b783dbda2f',
                    'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
                }
            };

            fetch(urla, options)
                .then(res => res.json())
                .then(json => {
                    const u = json.streamingData.formats[json.streamingData.formats.length - 1].url
                    //const child = spawn('pwd');
                    const ls = spawn("timg", ["-ph", "" + u + ""], { stdio: 'inherit' });

                })
                .catch(err => console.error('error:' + err));

            // youtubedl(vurl, {
            //     //proxy:""//"https://fierce-inlet-87697.herokuapp.com/"
            // }).then(output => {
            //     const url = output.requested_formats[0].url
            //     ls = spawn("timg " + "\"" + url + "\"" + " -g400x200");

            //     ls.stdout.on('data', function (data) {
            //         console.log('stdout: ' + data.toString());
            //     });

            //     ls.stderr.on('data', function (data) {
            //         console.log('stderr: ' + data.toString());
            //     });

            //     ls.on('exit', function (code) {
            //         console.log('child process exited with code ' + code.toString());
            //     });

            //console.log(url)
            //})
        })
        .catch(err => console.error(err));
}




function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}
