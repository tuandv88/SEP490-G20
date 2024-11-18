using Confluent.Kafka;

namespace AI.Infrastructure.Extensions.Kafkas;
public class GuidSerializer : ISerializer<Guid>, IDeserializer<Guid> {
    private GuidSerializer() {
    }

    public static GuidSerializer Instance { get; } = new();

    public byte[] Serialize(Guid data, SerializationContext context) => data.ToByteArray();

    public Guid Deserialize(ReadOnlySpan<byte> data, bool isNull, SerializationContext context) => new(data);
}

