import * as fs from 'fs';
import * as path from 'path';
import { CloudTrail, Tables } from 'typings';

const start = () => {
  const createPath = '../datas/create';
  const deletePath = '../datas/delete';
  const ignorePath = '../datas/ignore';

  const createFiles = fs.readdirSync(path.join(__dirname, createPath));
  const deleteFiles = fs.readdirSync(path.join(__dirname, deletePath));
  const ignoreFiles = fs.readdirSync(path.join(__dirname, ignorePath));

  const creates = createFiles.map<Tables.EventType>((item) => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, createPath, item)).toString()) as CloudTrail.Record;

    return {
      EventName: json.eventName,
      EventSource: json.eventSource,
      Create: true,
    };
  });

  const deletes = deleteFiles.map<Tables.EventType>((item) => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, deletePath, item)).toString()) as CloudTrail.Record;

    return {
      EventName: json.eventName,
      EventSource: json.eventSource,
      Delete: true,
    };
  });

  const ignores = ignoreFiles.map<Tables.EventType>((item) => {
    const json = JSON.parse(fs.readFileSync(path.join(__dirname, ignorePath, item)).toString()) as CloudTrail.Record;

    return {
      EventName: json.eventName,
      EventSource: json.eventSource,
      Ignore: true,
    };
  });

  fs.writeFileSync('./events_all.json', JSON.stringify([...creates, ...deletes, ...ignores]));
};

start();
