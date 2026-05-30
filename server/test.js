import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

console.log("DNS:", dns.getServers());

dns.resolveSrv(
    "_mongodb._tcp.cluster0.vkvloie.mongodb.net",
    (err, records) => {
        console.log(err);
        console.log(records);
    }
);