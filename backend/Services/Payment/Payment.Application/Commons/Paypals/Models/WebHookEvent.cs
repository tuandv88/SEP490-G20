using Newtonsoft.Json;

namespace Payment.Application.Commons.Paypals.Models;
public class WebHookEvent {
    [JsonProperty("id")]
    public string Id { get; set; } = string.Empty;

    [JsonProperty("event_version")]
    public string EventVersion { get; set; } = string.Empty;

    [JsonProperty("create_time")]
    public DateTime CreateTime { get; set; }

    [JsonProperty("resource_type")]
    public string ResourceType { get; set; } = string.Empty;

    [JsonProperty("resource_version")]
    public string ResourceVersion { get; set; } = string.Empty;

    [JsonProperty("event_type")]
    public string EventType { get; set; } = string.Empty;

    [JsonProperty("summary")]
    public string Summary { get; set; } = string.Empty;

    [JsonProperty("resource")]
    public object Resource { get; set; } = default!;

    public T GetResource<T>() where T : class {
        if (Resource is T typedResource) {
            return typedResource;
        }
        try {
            return JsonConvert.DeserializeObject<T>(Resource.ToString() ?? string.Empty)
                ?? throw new InvalidCastException($"Resource cannot be cast to type {typeof(T).FullName}.");
        } catch (JsonException ex) {
            throw new InvalidCastException($"Failed to deserialize Resource to type {typeof(T).FullName}: {ex.Message}", ex);
        }
    }
}

public class CheckoutOrderResource {
    [JsonProperty("id")]
    public string Id { get; set; } = string.Empty;

    [JsonProperty("intent")]
    public string Intent { get; set; } = string.Empty;

    [JsonProperty("status")]
    public string Status { get; set; } = string.Empty;

    [JsonProperty("create_time")]
    public DateTime CreateTime { get; set; }

    [JsonProperty("purchase_units")]
    public List<PurchaseUnit> PurchaseUnits { get; set; }

    [JsonProperty("payment_source")]
    public PaymentSource PaymentSource { get; set; }

    [JsonProperty("payer")]
    public Payer Payer { get; set; }
}

public class PurchaseUnit {
    [JsonProperty("reference_id")]
    public string ReferenceId { get; set; }

    [JsonProperty("amount")]
    public Amount Amount { get; set; }

    [JsonProperty("payee")]
    public Payee Payee { get; set; }
    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("custom_id")]
    public string CustomId { get; set; }

    [JsonProperty("items")]
    public List<Item> Items { get; set; }

    [JsonProperty("shipping")]
    public Shipping Shipping { get; set; }
}

public class Amount {
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }

    [JsonProperty("breakdown")]
    public Breakdown Breakdown { get; set; }
}

public class Breakdown {
    [JsonProperty("item_total")]
    public ItemTotal ItemTotal { get; set; }
}

public class ItemTotal {
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }
}

public class Payee {
    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("merchant_id")]
    public string MerchantId { get; set; }
}

public class Item {
    [JsonProperty("name")]
    public string Name { get; set; }

    [JsonProperty("unit_amount")]
    public UnitAmount UnitAmount { get; set; }

    [JsonProperty("quantity")]
    public string Quantity { get; set; }

    [JsonProperty("description")]
    public string Description { get; set; }

    [JsonProperty("sku")]
    public string Sku { get; set; }
}

public class UnitAmount {
    [JsonProperty("currency_code")]
    public string CurrencyCode { get; set; }

    [JsonProperty("value")]
    public string Value { get; set; }
}

public class Shipping {
    [JsonProperty("name")]
    public ShippingName Name { get; set; }

    [JsonProperty("address")]
    public ShippingAddress Address { get; set; }
}

public class ShippingName {
    [JsonProperty("full_name")]
    public string FullName { get; set; }
}

public class ShippingAddress {
    [JsonProperty("address_line_1")]
    public string AddressLine1 { get; set; }

    [JsonProperty("admin_area_2")]
    public string AdminArea2 { get; set; }

    [JsonProperty("admin_area_1")]
    public string AdminArea1 { get; set; }

    [JsonProperty("postal_code")]
    public string PostalCode { get; set; }

    [JsonProperty("country_code")]
    public string CountryCode { get; set; }
}

public class PaymentSource {
    [JsonProperty("paypal")]
    public Paypal Paypal { get; set; }
}

public class Paypal {
    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("account_id")]
    public string AccountId { get; set; }

    [JsonProperty("account_status")]
    public string AccountStatus { get; set; }

    [JsonProperty("name")]
    public Name Name { get; set; }

    [JsonProperty("address")]
    public Address Address { get; set; }
}

public class Name {
    [JsonProperty("given_name")]
    public string GivenName { get; set; }

    [JsonProperty("surname")]
    public string Surname { get; set; }
}

public class Address {
    [JsonProperty("country_code")]
    public string CountryCode { get; set; }
}

public class Payer {
    [JsonProperty("name")]
    public Name Name { get; set; }

    [JsonProperty("email_address")]
    public string EmailAddress { get; set; }

    [JsonProperty("payer_id")]
    public string PayerId { get; set; }

    [JsonProperty("address")]
    public Address Address { get; set; }
}

