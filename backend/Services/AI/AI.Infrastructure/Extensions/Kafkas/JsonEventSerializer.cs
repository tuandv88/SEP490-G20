using System.Text;
using System.Text.Json;
using Confluent.Kafka;

namespace AI.Infrastructure.Extensions.Kafkas;
public class JsonEventSerializer<T> : ISerializer<T>, IDeserializer<T> where T : class {
    private readonly Dictionary<string, Type> _eventTypeMap;

    public JsonEventSerializer() {
        _eventTypeMap = typeof(T)
            .Assembly
            .GetTypes()
            .Where(t => !t.IsAbstract && t.IsSubclassOf(typeof(T)))
            .ToDictionary(t => t.Name, t => t);
    }

    public byte[] Serialize(T data, SerializationContext context)
        => Encoding.UTF8.GetBytes(JsonSerializer.Serialize(data));

    public T Deserialize(ReadOnlySpan<byte> data, bool isNull, SerializationContext context) {
        if (isNull) {
            return null!;
        }

        var eventType = Encoding.UTF8.GetString(context.Headers.GetLastBytes("eventType"));
        var deserialized = (T)JsonSerializer.Deserialize(data, _eventTypeMap[eventType])!;
        return deserialized;
    }
}

