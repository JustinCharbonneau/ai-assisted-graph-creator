import json
import requests


def generate_graph():
    pass


def handler(event, context):

    yaml_topology = generate_graph()

    return {
        "headers": {"Content-Type": "application/json"},
        "statusCode": 200,
        "body": json.dumps({"message": "Lambda container image invoked!",
                            "event": event})
    }
