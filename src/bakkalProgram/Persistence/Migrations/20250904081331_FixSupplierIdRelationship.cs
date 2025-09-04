using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixSupplierIdRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId1",
                table: "ProcurementOrders");

            migrationBuilder.DropIndex(
                name: "IX_ProcurementOrders_SupplierId1",
                table: "ProcurementOrders");

            migrationBuilder.DropColumn(
                name: "SupplierId1",
                table: "ProcurementOrders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SupplierId1",
                table: "ProcurementOrders",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProcurementOrders_SupplierId1",
                table: "ProcurementOrders",
                column: "SupplierId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ProcurementOrders_Suppliers_SupplierId1",
                table: "ProcurementOrders",
                column: "SupplierId1",
                principalTable: "Suppliers",
                principalColumn: "Id");
        }
    }
}
