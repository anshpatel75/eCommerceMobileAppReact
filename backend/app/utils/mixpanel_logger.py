from mixpanel import Mixpanel

mp = Mixpanel("ffd6690baa7faf750a8c0da4d72d837c")

def track_event(event_name: str, distinct_id: str, properties: dict = {}):
    mp.track(distinct_id, event_name, properties)
