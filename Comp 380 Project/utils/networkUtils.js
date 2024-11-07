const axios = require('axios');
const os = require('os');

// Utility function to fetch public IP
async function getPublicIP() {
    console.log("Fetching host's public IP address...");
    try {
        const response = await axios.get("https://api.ipify.org?format=json");
        console.log("Public IP fetched successfully:", response.data.ip);
        return response.data.ip;
    } catch (error) {
        console.error("Error fetching public IP:", error);
        return "(ERR: CANNOT GET PUBLIC IP)";
    }
}


// Utility function to fetch all private IPs (IPv4) and their subnets
function getAllPrivateIPs() {
    const networkInterfaces = os.networkInterfaces();
    const privateIPs = [];

    console.log("Fetching host's private IP addresses (non-internal)...");

    // Iterate over each network interface name
    for (const interfaceName in networkInterfaces) {
        // Filter out non-internal IPv4 addresses
        const nonInternalIPv4Addresses = networkInterfaces[interfaceName].filter(
            addressInfo => addressInfo.family === 'IPv4' && !addressInfo.internal
        );

        nonInternalIPv4Addresses.forEach(ipInfo => {
            const subnet = calculateSubnetAddress(ipInfo.address, ipInfo.netmask);
            console.log(`Interface found: ${interfaceName}, IP Address: ${ipInfo.address}, Subnet: ${subnet}`);
            privateIPs.push({ interface: interfaceName, address: ipInfo.address, subnet: subnet });
        });
    }

    return privateIPs;
}

// Utility function to calculate subnet address of private IP
function calculateSubnetAddress(ip, netmask) {
    const ipParts = ip.split('.').map(part => parseInt(part, 10));
    const netmaskParts = netmask.split('.').map(part => parseInt(part, 10));

    const subnetParts = ipParts.map((part, index) => part & netmaskParts[index]);
    return subnetParts.join('.');
}

// Export the functions
module.exports = { getPublicIP, getAllPrivateIPs };
