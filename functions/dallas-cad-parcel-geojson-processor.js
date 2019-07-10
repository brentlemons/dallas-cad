var AWS = require('aws-sdk');

var topojson = require('topojson-server');
var turf = require('@turf/turf');

// const esIndex = process.env.esIndex;
// const esType = process.env.esType;
// const esHost = process.env.esHost;
// const esRegion = process.env.esRegion;

// Set the region 
AWS.config.update({region: 'us-west-2'});

var s3 = new AWS.S3();
var lambda = new AWS.Lambda();

// var es = require('elasticsearch').Client({
//     host: esHost,
//     connectionClass: require('http-aws-es'),
//     amazonES: {
//       region: esRegion,
//       credentials: new AWS.EnvironmentCredentials('AWS')
//     }
// });

/**
 * Get an object from a s3 bucket
 * 
 * @param  {string} key - Object location in the bucket
 * @return {object}     - A promise containing the response
 */
const getObject = (bucket,key) => {
    return new Promise((resolve, reject) => {
        s3.getObject({
            Bucket: bucket, // Assuming this is an environment variable...
            Key: key
        }, (err, data) => {
            if ( err ) reject(err);
            else resolve(data);
        });
    });
};

const callMarchingSquare = (whatToDo) => {
    return lambda.invoke(whatToDo).promise();//{
    //     FunctionName: 'toBeCalled',
    //     InvocationType: 'Event', //'RequestResponse',
    //     Payload: JSON.stringify({"phone": phone})
    // }).promise();
}


exports.handler = async (event) => {


    console.log(JSON.stringify(event));

    for (var pos = 0; pos < event.Records.length; ++pos) {

        var record = event.Records[pos].s3;
    
        const object = await getObject(record.bucket.name, record.object.key);
        
        var body = object.Body.toString();

        turf.propEach(JSON.parse(body), (currentFeature, featureIndex) => {
            console.log(currentFeature);
        });



    }


    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(event)
        // body: JSON.stringify(topojson.topology({stuff: resultGeojson}))
    };
    return response;
}