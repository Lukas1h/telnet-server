import net from "net"
import fetch from 'node-fetch'
global.fetch = fetch;
import { createApi } from 'unsplash-js';
import { exec, spawn } from "child_process"
import imageToAscii from "image-to-ascii"
import terminalImage from 'terminal-image';
import got from 'got';

port = process.env.PORT || 23

var sockets = [];
const unsplash = createApi({
    accessKey: '8m1k-HbbMnLRrNUrxz5X7RdjTbq0tX-lxbAb8X4rSis',
    fetch: fetch,
});



var s = net.Server(function (socket) {
    sockets.push(socket);
    const message = `
    WELCOME TO UNSPLASH TELNET SERVER
    PLEASE TYPE YOUR QUERY BELOW
    `
    socket.write(message + "\nSearch for: ")

    var index = sockets.indexOf(socket);
    
    socket.on('data', function (d) {
        for (var i = 0; i < sockets.length; i++) {

            const startbuff = Buffer.from("ff fb 25 ff fd 03 ff fb 18 ff fb 1f ff fb 20 ff fb 21 ff fb 22 ff fb 27 ff fd 05 ff fb 23".split(' ').join(''),"hex")
            const endbuff = Buffer.from("fff4fffd06","hex")
            if (!startbuff.compare(d) || !endbuff.compare(d)){
                console.log("Recived Telnet Noise. Filterd")
            }else{

                console.log("Recived Data ", d)
                if (i == index) {

                    sockets[i].write("Searching...\n")
                    unsplash.search.getPhotos({
                        query: d,
                        page: 1,
                        perPage: 1,
                    }).then((value => {
                        sockets[index].write("Done.\n")
                        //sockets[i].write("Done.\n" + value.response.results[0].urls.regular)
                        const u = value.response.results[0].urls.regular
                        got(u).buffer().then((body)=>{
                            terminalImage.buffer(body).then((dis)=>{
                                sockets[index].write(dis)
                                sockets[index].write("\nSearch for:")
                            })
                        })
                        
                        


                       
                    }))
                }
                
            }
            
        }
    });

    // remove sockets that disconnect from the array
    socket.on('end', function () {
        sockets.splice(index, 1);
    });
});
s.listen(port);