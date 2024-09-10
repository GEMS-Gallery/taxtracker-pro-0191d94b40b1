export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const TaxPayer = IDL.Record({
    'tid' : IDL.Nat,
    'address' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  return IDL.Service({
    'addTaxPayer' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'deleteTaxPayer' : IDL.Func([IDL.Nat], [Result], []),
    'getAllTaxPayers' : IDL.Func([], [IDL.Vec(TaxPayer)], ['query']),
    'getTaxPayer' : IDL.Func([IDL.Nat], [IDL.Opt(TaxPayer)], ['query']),
    'searchTaxPayer' : IDL.Func([IDL.Nat], [IDL.Opt(TaxPayer)], ['query']),
    'updateTaxPayer' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
