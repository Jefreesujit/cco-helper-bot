baseurl="https://prod.cybercodeonline.link/socket.io/?EIO=4&transport=polling&t=O6cdw7z"

res=$(curl -s $baseurl)

sid=$(echo $res | cut -c2- | jq -r .sid)
echo $sid

token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpsQ1BoUTctU2pscmZnZlBOdmhTYnlTWDIzT0xBZWI0dGNIcyIsImNoYW5uZWwiOiJmaXJlYmFzZSIsImlhdCI6MTY1NjM1NjY2MSwiZXhwIjo0ODEyMTE2NjYxfQ.cdpU5NHW-osU_w-Pl-6reHp_QSd49kz__CaYNTinezs"

url="$baseurl&sid=$sid"

echo $url

curl $url --data-raw '40{"idToken":"'$token'"}'
curl $url --data-raw '420["/m/l",{"t":"'$token'"}]'
curl $url --data-raw '421["/c/l",{"t":"'$token'","c":"S"}]422["/c/l",{"t":"'$token'","c":"95E6rc"}]'

node ./cco-server.js $sid
